import chrome from "chrome-aws-lambda";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

interface ScreenshotProps {
  isLocalhost?: boolean;
  url: string;
  width?: number;
  height?: number;
}

export class ScreenshotService {
  async makeScreenshot({
    isLocalhost,
    url,
    width = 1200,
    height = 630,
  }: ScreenshotProps): Promise<any> {
    const browserCore = isLocalhost ? puppeteer : puppeteerCore;
    const browser = await browserCore.launch({
      headless: true,
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      executablePath: await chrome.executablePath,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.setViewport({ width, height });

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await page.waitFor(1000);

    const screenshot = await page.screenshot({
      type: "webp",
      encoding: "binary",
      captureBeyondViewport: true,
      fullPage: true,
    });

    console.log({ screenshot });

    return screenshot;
  }

  async screenshot(data: ScreenshotProps) {
    return this.makeScreenshot(data);
  }
}
