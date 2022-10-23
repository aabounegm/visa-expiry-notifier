import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => ctx.reply("Welcome!"));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.launch().then(() => console.log("Bot started"));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
