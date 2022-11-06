/* eslint-disable @typescript-eslint/no-misused-promises */
import * as dotenv from "dotenv";
import * as cron from "node-cron";
import { Telegraf } from "telegraf";
import type { InferCreationAttributes } from "sequelize";

// Order is necessary to load .env file before other imports
dotenv.config();
import { User } from "./db";
import { getAllStudents } from "./sheets/api";
import { fetchAllOmnideskUsers } from "./omnidesk/api";
import { removeDuplicates } from "./omnidesk/helpers";

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// TODO: When integrating with Omnidesk, we should not intercept any messages, including /start command
bot.start((ctx) => ctx.reply("Welcome!"));

// At 8:00 AM every weekday, update our database with info from Omnidesk and Google Sheets
cron.schedule("0 8 * * 1-5", async (now) => {
  if (now === "manual") return; // Not sure why this is part of the type.

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
  console.log("Updated database successfully (using Google Sheets and Omnidesk)");
});

cron.schedule("0 9 * * 1-5", (now) => {
  if (now === "manual") return; // Not sure why this is part of the type.
  // TODO: get all users from Google Sheets, filter the ones whose docs are expiring soon
  //     and check if a msg has already been sent and send them a message
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.launch().then(() => console.log("Bot started"));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
