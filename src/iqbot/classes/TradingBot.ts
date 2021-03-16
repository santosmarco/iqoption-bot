import puppeteer from "puppeteer";
import * as components from "../components";
import { sleep, stepOras } from "../utils";
import IQSignal from "./IQSignal";

export default class TradingBot {
  private openAssetsQty = 1;

  constructor(
    private readonly browser: puppeteer.Browser,
    private readonly page: puppeteer.Page
  ) {}

  private clickComponent = async (
    component: keyof typeof components,
    options?: puppeteer.MouseOptions & { sleepAfter?: number }
  ) => {
    await this.page.mouse.click(
      components[component].x,
      components[component].y,
      { ...options }
    );
    if (options && options.sleepAfter) {
      await this.sleep(options.sleepAfter);
    }
  };

  private typeComponent = async (
    component: keyof typeof components,
    text: string,
    options?: puppeteer.MouseOptions & {
      sleepAfterClick?: number;
      sleepAfter?: number;
      clear?: boolean;
    }
  ) => {
    await this.clickComponent(
      component,
      options && {
        button: options.button,
        clickCount: options.clickCount,
        sleepAfter: options.sleepAfterClick,
      }
    );
    if (options && options.clear) {
      for (let i = 0; i < 15; i++) {
        await this.page.keyboard.press("Backspace");
      }
    }
    await this.page.keyboard.type(text);
    if (options && options.sleepAfter) {
      await this.sleep(options.sleepAfter);
    }
  };

  openAsset = async (name: string) => {
    if (this.openAssetsQty > 1) {
      await this.closeAsset();
    }
    await this.clickComponent("openNewAssetBtn", { sleepAfter: 2000 });
    await this.typeComponent(
      "searchAssetInput",
      name.split(" ").join().toUpperCase(),
      { sleepAfter: 1000 }
    );
    await this.clickComponent("assetFromSearchBtn", { sleepAfter: 2000 });
    this.openAssetsQty++;
  };

  closeAsset = async (options?: { force?: boolean }) => {
    if (!(options && options.force) && this.openAssetsQty === 1) {
      return;
    }
    await this.clickComponent("closeAssetBtn", { sleepAfter: 1000 });
    this.openAssetsQty--;
  };

  setAmount = async (amount: number) => {
    await this.typeComponent("amountInput", amount.toString(), { clear: true });
  };

  setTime = async (column: 1 | 2, row: 1 | 2 | 3 | 4 | 5) => {
    const timeComponent = {
      x: column === 1 ? 1150 : 1300,
      y: 188 + 34 * (row - 1) + 34 / 2,
    };
    await this.clickComponent("timeMenuBtn", { sleepAfter: 1000 });
    await this.page.mouse.click(timeComponent.x, timeComponent.y);
  };

  clickHigher = async () => {
    await this.clickComponent("higherBtn");
  };

  clickLower = async () => {
    await this.clickComponent("lowerBtn");
  };

  runSignal = async (signal: IQSignal) => {
    stepOras["SIGNAL"].start(
      `Running: ${signal.name}... ${Math.round(
        signal.getTime().remaining / 1000
      )}s`
    );
    const oraUpdater = setInterval(() => {
      stepOras["SIGNAL"].text(
        `Running: ${signal.name}... ${Math.round(
          signal.getTime().remaining / 1000
        )}s`
      );
    }, 1000);
    await this.openAsset(signal.name);
    await this.setAmount(1);
    await this.sleep(signal.getTime().remaining - 20000);
    await this.setTime(1, 5);
    await this.sleep(signal.getTime().remaining - 1500);
    await this.clickComponent(
      signal.action === "CALL" ? "higherBtn" : "lowerBtn"
    );
    clearInterval(oraUpdater);
    stepOras["SIGNAL"].text(`Waiting: ${signal.name}...`);
    await this.sleep(5 * 60 * 1000);
    stepOras["SIGNAL"].done(`Done running: ${signal.name}!`);
  };

  closeBrowser = async () => {
    await this.browser.close();
  };

  sleep = sleep;
}
