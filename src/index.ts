import * as dotenv from "dotenv";
import * as cron from "node-cron";
import { Telegraf } from "telegraf";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => ctx.reply("Welcome!"));

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
