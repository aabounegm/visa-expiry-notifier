import { type InferCreationAttributes } from "sequelize";
import { User } from "./user";
import { getAllStudents } from "../sheets/api";
import { fetchAllOmnideskUsers } from "../omnidesk/api";
import { removeDuplicates } from "../omnidesk/helpers";

export const DAYS_TO_VISA_EXPIRY = 40;
export const DAYS_TO_REGISTRATION_EXPIRY = 7;

export async function populateUsers() {
  await User.sync();
  const sheetStudents = await getAllStudents();
  const omniUsers = removeDuplicates(await fetchAllOmnideskUsers());
  const sheetsUsersMap = new Map(
    sheetStudents.filter((user) => !!user.telegram).map((user) => [user.telegram, user])
  );
  const usersWithTg = omniUsers.filter(({ user_screen_name }) =>
    sheetsUsersMap.has(user_screen_name)
  );
  const usersToInsert: InferCreationAttributes<User>[] = usersWithTg.map((user) => {
    const { user_screen_name, telegram_id, user_full_name } = user;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { registrationExpiry, visaExpiry } = sheetsUsersMap.get(user_screen_name)!;
    return {
      fullName: user_full_name,
      telegramUsername: user_screen_name,
      telegramChatId: Number(telegram_id),
      visaExpiration: visaExpiry,
      registrationExpiration: registrationExpiry,
      registrationLastNotified: null,
      visaLastNotified: null,
    };
  });
  await User.bulkCreate(usersToInsert, { ignoreDuplicates: true });
}
