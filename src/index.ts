/* eslint-disable @typescript-eslint/no-misused-promises */
import * as dotenv from "dotenv";
import * as cron from "node-cron";
import { Telegraf } from "telegraf";

// Order is necessary to load .env file before other imports
dotenv.config();
import { populateUsers } from "./db/utils";
import { katyaChatId, getPendingMesages, updateLastNotified } from "./notifier";
import { chunkMessages } from "./notifier/utils";

const bot = new Telegraf(process.env.BOT_TOKEN as string);
const VISA_PAYMENT_SLIP = "https://imgur.com/Fe9irbv";

// At 8:00 AM every weekday, update our database with info from Omnidesk and Google Sheets
cron.schedule("0 8 * * 1-5", async () => {
  console.log();
  await populateUsers();
  console.log("Updated database successfully (using Google Sheets and Omnidesk)");
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TelegramError {
  response: {
    ok: false;
    error_code: number;
    description: string;
  };
  on: {
    method: string;
    payload: { chat_id: number };
  };
}

// At 9:00 AM every weekday, send notifications to users whose visa or registration is about to expire
cron.schedule("0 9 * * 1-5", async () => {
  console.log(`[${new Date().toLocaleString()}] Checking for any expiring docs`);
  const messages = await getPendingMesages();
  const toKatya = messages.filter((message) => message.chat_id === katyaChatId);
  const katyaMsgs = toKatya.map(({ message }) => message);
  const rateLimit = 25;
  for (const { chat_id, username, message, type } of messages) {
    const recipient = chat_id === katyaChatId ? "Daria" : chat_id;
    console.log(`Notifying ${recipient} (@${username}) about expiring ${type}`);
    if (chat_id !== katyaChatId) {
      await bot.telegram
        .sendMessage(chat_id, message, { parse_mode: "MarkdownV2" })
        .catch(({ response }: TelegramError) => {
          console.error(
            `\tError sending message to ${chat_id} (@${username}): ${response.description}`
          );
          katyaMsgs.push(
            `Failed to notify @${username} about expiring ${type}\n\tError: ${response.description}`
          );
        });
      if (type === "visa") {
        await bot.telegram.sendPhoto(chat_id, VISA_PAYMENT_SLIP).catch(console.error);
      }
    }
    await updateLastNotified(username, type);
    await delay(1000 / rateLimit);
  }
  for (const msg of chunkMessages(katyaMsgs)) {
    await bot.telegram
      .sendMessage(katyaChatId, msg, { parse_mode: "MarkdownV2" })
      .catch(console.error);
  }
  console.log(`Sent ${messages.length} notifications.`);
});

// WARNING: uncommenting the following line will remove Omnidesk's webhook & start polling instead
// bot.launch().then(() => console.log("Bot started"));
