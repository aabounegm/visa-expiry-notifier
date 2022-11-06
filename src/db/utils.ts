import { type InferCreationAttributes } from "sequelize";
import { User } from "./user";
import { sequelize } from "./index";
import { getAllStudents } from "../sheets/api";
import { fetchAllOmnideskUsers } from "../omnidesk/api";
import { removeDuplicates } from "../omnidesk/helpers";

export const DAYS_TO_VISA_EXPIRY = 40;
export const DAYS_TO_REGISTRATION_EXPIRY = 7;

export async function populateUsers() {
  await sequelize.sync();
  const sheetStudents = await getAllStudents();
  console.log("Total students in Sheet:", sheetStudents.length);
  const sheetsUsersMap = new Map(
    sheetStudents.filter((user) => !!user.telegram).map((user) => [user.telegram, user])
  );
  console.log("Students in Sheet with Telegram:", sheetsUsersMap.size);
  const omniUsers = removeDuplicates(await fetchAllOmnideskUsers());
  const usersWithTg = omniUsers.filter(({ user_screen_name }) =>
    sheetsUsersMap.has(user_screen_name)
  );
  console.log("Students in Omnidesk & Sheets:", usersWithTg.length);
  const usersToInsert: InferCreationAttributes<User>[] = usersWithTg.map((user) => {
    const { user_screen_name, telegram_id } = user;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { registrationExpiry, visaExpiry, name } = sheetsUsersMap.get(user_screen_name)!;
    return {
      fullName: name,
      telegramUsername: user_screen_name,
      telegramChatId: Number(telegram_id),
      visaExpiration: visaExpiry,
      registrationExpiration: registrationExpiry,
      registrationLastNotified: null,
      visaLastNotified: null,
    };
  });
  console.log("Inserting", usersToInsert.length, "users");
  await User.bulkCreate(usersToInsert, { ignoreDuplicates: true });
}
