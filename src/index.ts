/* eslint-disable @typescript-eslint/no-misused-promises */
import * as dotenv from "dotenv";
import * as cron from "node-cron";
import { Telegraf } from "telegraf";

// Order is necessary to load .env file before other imports
dotenv.config();
import { populateUsers } from "./db/utils";
import { getPendingMesages, updateLastNotified } from "./notifier";

const bot = new Telegraf(process.env.BOT_TOKEN as string);

// At 8:00 AM every weekday, update our database with info from Omnidesk and Google Sheets
cron.schedule("0 8 * * 1-5", async (now) => {
  if (now === "manual") return; // Not sure why this is part of the type.
  await populateUsers();
  console.log("Updated database successfully (using Google Sheets and Omnidesk)");
});

// At 9:00 AM every weekday, send notifications to users whose visa or registration is about to expire
cron.schedule("0 9 * * 1-5", async (now) => {
  if (now === "manual") return; // Not sure why this is part of the type.
  console.log(`[${new Date().toLocaleDateString()}] Checking for any expiring docs`);
  const messages = await getPendingMesages();
  await Promise.all(
    messages.map(async ({ chat_id, username, message, type }) => {
      console.log(`Notifying ${chat_id} (@${username}) about expiring ${type}`);
      await bot.telegram.sendMessage(chat_id, message, { parse_mode: "MarkdownV2" });
      await updateLastNotified(username, type);
    })
  );
  console.log(`Sent ${messages.length} notifications.`);
});

// WARNING: uncommenting the following line will remove Omnidesk's webhook & start polling instead
// bot.launch().then(() => console.log("Bot started"));
