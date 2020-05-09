import { NowRequest, NowResponse } from '@now/node';
import { fetchAndUpdateCurrentBells } from '../../components/database';

export default async (_req: NowRequest, res: NowResponse) => {
  res.setHeader("Content-Type", "text/plain");

  try {
    const n = await fetchAndUpdateCurrentBells();

    res.statusCode = 200;
    if (n < 0) {
      res.end(`Adeline has negative ${-n} bells. Keep trying!`);
    }

    if (n > 0) {
      res.end(`Adeline has ${n} bells! Good job!`);
    }

    if (n === 0) {
      res.end("Adeline doesn't have any bells right now. Maybe work on some homework!");
    }
  } catch (e) {
    res.statusCode = 500;
    res.end("It didn't, sorry!");
  }
};