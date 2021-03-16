import puppeteer from "puppeteer";
import { TradingBot } from "./classes";
import { sleep, stepOras } from "./utils";
export { IQSignal } from "./classes";

type Connect = (
  credentials: {
    email: string;
    password: string;
  },
  cb?: (bot: TradingBot) => void,
  options?: {
    headless?: boolean;
    logs?: boolean;
  }
) => Promise<TradingBot>;

const DEFAULT_CONNECT_OPTIONS: Required<NonNullable<Parameters<Connect>[2]>> = {
  headless: true,
  logs: true,
};

const iqbot = (): { connect: Connect } => {
  const enterTradeRoom = async (page: puppeteer.Page) => {
    await page.goto("https://iqoption.com/traderoom");
    try {
      await page.waitForSelector("canvas.active");
    } catch (e) {
      await enterTradeRoom(page);
    }
    await sleep(1000);
  };

  const signIn = async (
    page: puppeteer.Page,
    credentials: Parameters<Connect>[0],
    options: { logs?: boolean }
  ) => {
    await page.goto("https://login.iqoption.com/en/login");
    await page.waitForSelector(
      "button.Button.Button_green.Button_big.Button_fontBig"
    );

    options.logs &&
      stepOras["SIGN IN"].text(`Entering e-mail: ${credentials.email}...`);
    await page.mouse.click(800, 200);
    await page.keyboard.type(credentials.email);

    options.logs && stepOras["SIGN IN"].text(`Entering password...`);
    await page.mouse.click(800, 270);
    await page.keyboard.type(credentials.password);

    await page.mouse.click(800, 340);

    options.logs && stepOras["SIGN IN"].text(`Waiting for sign in...`);
    await page.waitForSelector("button.Button.NavBtn.Button_orange");

    return page;
  };

  const connect: Connect = async (credentials, cb, options) => {
    options = { ...DEFAULT_CONNECT_OPTIONS, ...options };

    options.logs && stepOras["LAUNCH"].start("Launching browser...");
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1500, height: 700 },
      headless: options.headless,
    });
    process.on("SIGINT", () => {
      browser.close();
    });
    options.logs && stepOras["LAUNCH"].done("Browser launched!");

    options.logs &&
      stepOras["INIT PAGE"].start("Initializing browser's page...");
    let page = (await browser.pages())[0];
    if (!page) {
      page = await browser.newPage();
    }
    options.logs && stepOras["INIT PAGE"].done("Page initialized!");

    options.logs && stepOras["SIGN IN"].start("Signing in...");
    await signIn(page, credentials, { logs: options.logs });
    options.logs && stepOras["SIGN IN"].done("Signed in!");

    options.logs && stepOras["TRADE ROOM"].start("Accessing trade room...");
    await enterTradeRoom(page);
    options.logs && stepOras["TRADE ROOM"].done("Trade room's ready!");

    const bot = new TradingBot(browser, page);
    if (cb) {
      cb(bot);
    }
    return bot;
  };

  return { connect };
};

export default iqbot;
