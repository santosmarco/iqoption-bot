import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import iqbot, { IQSignal } from "./iqbot";

dotenv.config();

const bot = iqbot();

let SIGNALS: IQSignal[] = [];

bot.connect(
  { email: process.env["IQ_EMAIL"]!, password: process.env["IQ_PASSWORD"]! },
  async (bot) => {
    const telegram = new Telegraf(process.env["TELEGRAM_TOKEN"]!);

    telegram.use(
      Telegraf.filter(({ message }) => {
        const now = new Date().getTime() / 1000;
        return !message || message.date > now - 60 * 15;
      })
    );

    telegram.on("message", async (ctx) => {
      try {
        if (SIGNALS.length > 0) {
          ctx.reply("Bot is already running.");
        } else {
          // @ts-ignore
          SIGNALS = IQSignal.parse(ctx.message.text);
          if (SIGNALS.length === 0) {
            ctx.reply("No future signals found.");
          } else {
            ctx.reply(
              `Found ${SIGNALS.length} future signals:\n• ${SIGNALS.map(
                (signal) =>
                  `${signal.name} (${signal
                    .getTime()
                    .moment.format("HH:mm:ss")})`
              ).join("\n• ")}`
            );
            for (let i = 0; i < SIGNALS.length; i++) {
              const signal = SIGNALS[i]!;
              ctx.reply(`[SIGNAL] Running: ${signal.name}...`);
              await bot.runSignal(signal);
              ctx.reply(`[SIGNAL] Done: ${signal.name}.`);
            }
            ctx.reply("Bot has ran all signals successfully.");
            SIGNALS = [];
          }
        }
      } catch (e) {}
    });

    telegram.launch();
  }
);
