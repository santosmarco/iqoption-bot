import puppeteer from "puppeteer";

export default class TradingBot {
  constructor(
    private readonly browser: puppeteer.Browser,
    private readonly page: puppeteer.Page
  ) {}
}
