/* eslint-disable @typescript-eslint/no-misused-promises */
import * as dotenv from "dotenv";
import * as cron from "node-cron";
import { Telegraf } from "telegraf";

// Order is necessary to load .env file before other imports
dotenv.config();
import { populateUsers } from "./db/utils";

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// TODO: When integrating with Omnidesk, we should not intercept any messages, including /start command
bot.start((ctx) => ctx.reply("Welcome!"));

// At 8:00 AM every weekday, update our database with info from Omnidesk and Google Sheets
cron.schedule("0 8 * * 1-5", async (now) => {
  if (now === "manual") return; // Not sure why this is part of the type.
  await populateUsers();
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
