import axios from 'axios';
import express from 'express';
import { log } from '~/lib/log4js';

export const WordRouter = express.Router();

// GET /api/word/:word
WordRouter.get('/api/word/:word', async (req, res, next) => {
  try {
    log.info('GET /api/word/:word', req.params);

    // input
    const word = req.params.word;

    if (!word) {
      return res.json({ ok: false });
    }

    return axios
      .get(`https://dictionary.goo.ne.jp/srch/jn/${word}/m1u/`)
      .then(() => res.json({ ok: true }))
      .catch(() => res.json({ ok: false }));
  } catch (e) {
    log.error(e, res.headersSent);
    return next(e);
  } finally {
    log.info('GET /api/word/:word', 'END');
  }
});
