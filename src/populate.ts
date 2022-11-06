import * as dotenv from "dotenv";
dotenv.config();

import type { InferCreationAttributes } from "sequelize";
import { fetchAllOmnideskUsers } from "./omnidesk/api";
import { User } from "./db";
import { OmnideskUser } from "./omnidesk/types";

function removeDuplicates(users: OmnideskUser[]): OmnideskUser[] {
  const userNameCache: Record<string, number> = {};
  const tgIdCache: Record<string, number> = {};
  return users.filter((user, i, users) => {
    if (user.user_screen_name in userNameCache) {
      const idx = userNameCache[user.user_screen_name];
      console.warn(`Duplicate telegram alias found:`, user, users[idx]);
      return false;
    }
    userNameCache[user.user_screen_name] = i;

    if (user.telegram_id in tgIdCache) {
      const idx = tgIdCache[user.telegram_id];
      console.warn(`Duplicate telegram chat_id found:`, user, users[idx]);
      return false;
    }
    tgIdCache[user.telegram_id] = i;
    return true;
  });
}

async function main() {
  await User.sync({ force: true });
  const omniUsers = await fetchAllOmnideskUsers();
  const usersToCreate = removeDuplicates(omniUsers);
  const dbUsers: InferCreationAttributes<User>[] = usersToCreate
    .filter((user) => user.telegram_id != null)
    .map((user) => ({
      fullName: user.user_full_name,
      telegramUsername: user.user_screen_name,
      telegramChatId: Number(user.telegram_id),
      registrationLastNotified: null,
      visaLastNotified: null,
    }));

  await User.bulkCreate(dbUsers);
  console.log("Users added successfully");
}

void main();
