import * as dotenv from "dotenv";
dotenv.config();

import type { InferCreationAttributes } from "sequelize";
import { fetchAllOmnideskUsers } from "./omnidesk/api";
import { User } from "./db";
import { removeDuplicates } from "./omnidesk/helpers";

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
      registrationExpiration: null,
      visaExpiration: null,
    }));

  await User.bulkCreate(dbUsers);
  console.log("Users added successfully");
}

void main();
