import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ScreenshotService } from "../../ScreenshotService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.url === "string", "url param is not provided");

  const isLocalhost = req.headers.host === "localhost:3001";
  const screenshotService = new ScreenshotService();
  const screenshot = await screenshotService.screenshot({
    isLocalhost,
    url: req.query.url as string,
    width: Number(req.query.width) || undefined,
    height: Number(req.query.height) || undefined,
  });

  const buffer = new Buffer(screenshot, "base64");

  res.status(200);

  return res.end(buffer);
}
