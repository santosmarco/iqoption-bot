import dotenv from "dotenv";
import ora from "ora";
import puppeteer, { Browser, Page } from "puppeteer";
import { BotConfig, BotMethodOptions } from "../types";
import { sleep } from "../utils";
import IQSignal from "./IQSignal";

dotenv.config();

export default class Bot {
  private browser?: Browser;
  private page?: Page;

  private urls: BotConfig["urls"];
  private components: BotConfig["components"];

  private _isReady = false;

  constructor(config: BotConfig) {
    this.urls = config.urls;
    this.components = config.components;
  }

  get isReady() {
    return this._isReady;
  }

  private launch = async () => {
    const launchOra = ora().start("Launching...");

    this.browser = await puppeteer.launch({
      defaultViewport: { width: 1500, height: 700 },
      headless: false,
    });
    // this.browser = await puppeteer.launch();

    process.on("SIGINT", () => {
      if (this.browser) {
        this.browser.close();
      }
    });

    const firstPage = (await this.browser.pages())[0];
    if (firstPage) {
      this.page = firstPage;
    } else {
      this.page = await this.browser.newPage();
    }

    launchOra.succeed("Launched!");
  };

  private goToUrl = async (
    urlId: keyof Bot["urls"],
    options?: BotMethodOptions
  ) => {
    if (!this.page) {
      throw new Error("Bot has not been launched.");
    }
    await this.page.goto(this.urls[urlId]);
    if (options) {
      if (options.sleepAfter) {
        await sleep(options.sleepAfter);
      }
    }
  };

  private waitForSelector = async (selector: string) => {
    if (!this.page) {
      throw new Error("Bot has not been launched.");
    }
    await this.page.waitForSelector(selector);
  };

  private click = async (
    componentId: keyof Bot["components"],
    options?: BotMethodOptions
  ) => {
    if (!this.page) {
      throw new Error("Bot has not been launched.");
    }
    const { x, y } = this.components[componentId];
    await this.page.mouse.click(x, y);
    if (options) {
      if (options.sleepAfter) {
        await sleep(options.sleepAfter);
      }
    }
  };

  private type = async (
    componentId: keyof Bot["components"],
    text: string,
    options?: BotMethodOptions
  ) => {
    await this.click(componentId);
    await this.page!.keyboard.type(text);
    if (options) {
      if (options.sleepAfter) {
        await sleep(options.sleepAfter);
      }
    }
  };

  private signIn = async () => {
    const signInOra = ora().start("Signing in...");
    await this.goToUrl("signIn");
    await this.waitForSelector(
      "button.Button.Button_green.Button_big.Button_fontBig"
    );
    await this.type("emailInput", process.env["BOT_EMAIL"]!);
    await this.type("passwordInput", process.env["BOT_PASSWORD"]!);
    await this.click("signInBtn");
    await this.waitForSelector("button.Button.NavBtn.Button_orange");
    signInOra.succeed("Signed in!");
  };

  private accessTradeRoom = async () => {
    const tradeRoomOra = ora().start("Entering trade room...");
    await this.goToUrl("tradeRoom", { sleepAfter: 20000 });
    tradeRoomOra.succeed("Trade room's ready!");
  };

  private waitForSignal = async (signal: IQSignal) => {
    await sleep(signal.time.remaining);
  };

  private runSignal = async (signal: IQSignal) => {
    const signalOra = ora().start(`Running signal: ${signal.name}...`);
    await this.click("openNewAssetBtn", { sleepAfter: 2000 });
    await this.type("searchAssetInput", signal.name, { sleepAfter: 1000 });
    await this.click("searchedAssetBtn");
    await this.waitForSignal(signal);
    signalOra.succeed(`Ran signal: ${signal.name}!`);
  };

  start = async () => {
    this._isReady = false;
    await this.launch();
    await this.signIn();
    await this.accessTradeRoom();
    this._isReady = true;
  };

  runSignals = async (signals: IQSignal[]) => {
    if (!this.isReady) {
      await this.start();
    }
    for (let i = 0; i < signals.length; i++) {
      await this.runSignal(signals[i]!);
    }
  };
}
