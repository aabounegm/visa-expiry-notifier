/* eslint-disable @typescript-eslint/no-misused-promises */
import * as dotenv from "dotenv";
import * as cron from "node-cron";
import { Telegraf } from "telegraf";

// Order is necessary to load .env file before other imports
dotenv.config();
import { populateUsers } from "./db/utils";
import { dariaChatId, getPendingMesages, updateLastNotified } from "./notifier";

const bot = new Telegraf(process.env.BOT_TOKEN as string);
const VISA_PAYMENT_SLIP = "https://imgur.com/Fe9irbv";

// At 8:00 AM every weekday, update our database with info from Omnidesk and Google Sheets
cron.schedule("0 8 * * 1-5", async () => {
  await populateUsers();
  console.log("Updated database successfully (using Google Sheets and Omnidesk)");
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// At 9:00 AM every weekday, send notifications to users whose visa or registration is about to expire
cron.schedule("0 9 * * 1-5", async () => {
  console.log(`[${new Date().toLocaleDateString()}] Checking for any expiring docs`);
  const messages = await getPendingMesages();
  const rateLimit = 25;
  for (const { chat_id, username, message, type } of messages) {
    console.log(`Notifying ${chat_id} (@${username}) about expiring ${type}`);
    if (chat_id !== dariaChatId) {
      await bot.telegram.sendMessage(chat_id, message, { parse_mode: "MarkdownV2" });
      if (type === "visa") {
        await bot.telegram.sendPhoto(chat_id, VISA_PAYMENT_SLIP);
      }
    }
    await updateLastNotified(username, type);
    await delay(1000 / rateLimit);
  }
  const toDaria = messages.filter((message) => message.chat_id === dariaChatId);
  const dariaMsg = toDaria.map(({ message }) => message).join("\n");
  if (dariaMsg !== "") {
    await bot.telegram.sendMessage(dariaChatId, dariaMsg, { parse_mode: "MarkdownV2" });
  }
  console.log(`Sent ${messages.length} notifications.`);
});

// WARNING: uncommenting the following line will remove Omnidesk's webhook & start polling instead
// bot.launch().then(() => console.log("Bot started"));
