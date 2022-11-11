import type { OmnideskUser } from "./types";
import { overrides } from "./overrides";

const API_KEY = process.env.OMNIDESK_API_KEY as string;
const staffEmail = "v.kondratieva@innopolis.ru";
const omniDeskBase = "https://student-affairs.omnidesk.ru";

// Docs: https://omnidesk.ru/api/users#view_all_users

const token = Buffer.from(`${staffEmail}:${API_KEY}`).toString("base64");

interface UserResponse {
  user: OmnideskUser;
}

interface UsersResponse {
  total_count: number;
  [key: number]: UserResponse;
}

/** Get a list of all Telegram users from Omnidesk */
export async function fetchAllOmnideskUsers() {
  let total_count = 0;
  const users: OmnideskUser[] = [];
  const limit = 100; // 100 is the max supported by Omnidesk
  let page = 1;

  do {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const res = await fetch(`${omniDeskBase}/api/users.json?${params.toString()}`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });
    const data = (await res.json()) as UsersResponse;
    ({ total_count } = data);

    // Convert data from object to array
    for (let i = 0; i < limit && users.length < total_count; i++) {
      const user = data[i].user;
      users.push({ ...user, user_screen_name: user.user_screen_name.toLowerCase() });
    }
    page++;
  } while (users.length < total_count);

  const tgUsers = users.filter((user) => user.type === "telegram");
  return tgUsers.map((user) => {
    const override = overrides.find((o) => o.user_id === user.user_id);
    return override ? { ...user, ...override } : user;
  });
}
