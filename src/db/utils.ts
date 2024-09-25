import type { InferCreationAttributes } from "sequelize";
import { User } from "./user";
import { sequelize } from "./index";
import { getAllStudents } from "../sheets/api";
import { fetchAllOmnideskUsers } from "../omnidesk/api";
import { removeDuplicates } from "../omnidesk/helpers";

export const DAYS_TO_VISA_EXPIRY = 50;
export const DAYS_TO_REGISTRATION_EXPIRY = 25;
export const DAYS_TO_MEDICAL_EXPIRY = 20;

export async function populateUsers() {
  console.log(`[${new Date().toLocaleString()}] Populating users...`);
  await sequelize.sync();
  const sheetStudents = await getAllStudents();
  console.log("Total students in Sheet:", sheetStudents.length);
  const sheetsUsersMap = new Map(
    sheetStudents.filter((user) => !!user.telegram).map((user) => [user.telegram, user])
  );
  console.log("Students in Sheet with Telegram:", sheetsUsersMap.size);
  const omniUsers = removeDuplicates(await fetchAllOmnideskUsers());
  console.log("Total students in Omnidesk:", omniUsers.length);
  const commonUsers = omniUsers.filter(({ user_screen_name }) =>
    sheetsUsersMap.has(user_screen_name)
  );
  const omniUsersMap = new Map(omniUsers.map((user) => [user.user_screen_name, user]));
  console.log("Students in Omnidesk & Sheets:", commonUsers.length);
  const usersToInsert: InferCreationAttributes<User>[] = sheetStudents
    .filter((user) => !!user.telegram)
    .map((user) => {
      const { telegram, name, visaExpiry, registrationExpiry, medicalExpiry } = user;
      const omniUser = omniUsersMap.get(telegram);
      return {
        fullName: name,
        telegramUsername: telegram,
        telegramChatId: omniUser == undefined ? null : Number(omniUser.telegram_id),
        visaExpiration: visaExpiry,
        registrationExpiration: registrationExpiry,
        medicalExpiration: medicalExpiry,
        registrationLastNotified: null,
        visaLastNotified: null,
        medicalLastNotified: null,
      };
    });
  console.log(
    "Users without Telegram (username or chat_id):",
    usersToInsert.length - commonUsers.length
  );
  console.log("Inserting/updating", usersToInsert.length, "users");
  await User.bulkCreate(usersToInsert, {
    ignoreDuplicates: true,
    updateOnDuplicate: [
      "registrationExpiration",
      "visaExpiration",
      "medicalExpiration",
      "telegramChatId",
    ],
  });
}
