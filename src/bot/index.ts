import puppeteer from "puppeteer";
import { TradingBot } from "./classes";

const iq = () => {
  const signIn = async (
    page: puppeteer.Page,
    credentials: { email: string; password: string }
  ) => {
    await page.goto("https://login.iqoption.com/en/login");
    await page.waitForSelector(
      "button.Button.Button_green.Button_big.Button_fontBig"
    );
    await page.mouse.click(800, 200);
    await page.keyboard.type(credentials.email);
    await page.mouse.click(800, 270);
    await page.keyboard.type(credentials.password);
    await page.mouse.click(800, 340);
    await page.waitForSelector("button.Button.NavBtn.Button_orange");
    await page.goto("https://iqoption.com/traderoom");
    // sleep or wait for something (what?)...
    return page;
  };

  const handleConnect = async (
    credentials: { email: string; password: string },
    cb: (bot: TradingBot) => void
  ) => {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1500, height: 700 },
    });
    let page = (await browser.pages())[0];
    if (!page) {
      page = await browser.newPage();
    }
    await signIn(page, credentials);
    cb(new TradingBot(browser, page));
  };

  return {
    connect: (
      credentials: { email: string; password: string },
      cb: (bot: TradingBot) => void
    ) => {
      handleConnect(credentials, cb);
    },
  };
};

export default iq;
