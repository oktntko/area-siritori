import express from 'express';
import { firstBy, isNumber } from 'remeda';
import { log } from '~/lib/log4js';

export const UserRouter = express.Router();

// GET /api/user
UserRouter.get('/api/user', async (req, res, next) => {
  try {
    log.info('GET /api/user', 'BEGIN');

    return res.json(UserTable);
  } catch (e) {
    log.error(e, res.headersSent);
    return next(e);
  } finally {
    log.info('GET /api/user', 'END');
  }
});

// GET /api/user/:user_id
UserRouter.get('/api/user/:user_id', async (req, res, next) => {
  try {
    log.info('GET /api/user/:user_id', req.params);

    // input
    const user_id = Number(req.params.user_id);
    if (!isNumber(user_id) || !Number.isInteger(user_id)) {
      throw new Error('400 Bad Request');
    }

    // logic
    const user = UserTable.find((user) => user.user_id === user_id);
    if (!user) {
      throw new Error('404 Not Found');
    }

    // output
    return res.json(user);
  } catch (e) {
    return next(e);
  } finally {
    log.info('GET /api/user/:user_id', req.params);
  }
});

// POST /api/user
UserRouter.post('/api/user', async (req, res, next) => {
  try {
    log.info('POST /api/user', req.body);

    // input
    const { username, email } = req.body;
    if (!username || typeof username !== 'string') {
      throw new Error('400 Bad Request');
    }
    if (!email || typeof email !== 'string') {
      throw new Error('400 Bad Request');
    }

    // logic
    const max = firstBy(UserTable, [(x) => x.user_id, 'desc']);

    const user = {
      user_id: (max?.user_id ?? 1) + 1,
      username,
      email,
      updated_at: new Date().toISOString(),
    };

    UserTable.push(user);

    // output
    return res.json(user);
  } catch (e) {
    return next(e);
  } finally {
    log.info('POST /api/user', req.params);
  }
});

// PUT /api/user/:user_id
UserRouter.put('/api/user/:user_id', async (req, res, next) => {
  try {
    log.info('PUT /api/user/:user_id', req.params, req.body);

    // input
    const user_id = Number(req.params.user_id);
    const { username, email } = req.body;
    if (!isNumber(user_id) || !Number.isInteger(user_id)) {
      throw new Error('400 Bad Request');
    }
    if (!username || typeof username !== 'string') {
      throw new Error('400 Bad Request');
    }
    if (!email || typeof email !== 'string') {
      throw new Error('400 Bad Request');
    }

    // logic
    const user = UserTable.find((user) => user.user_id === user_id);
    if (!user) {
      throw new Error('404 Not Found');
    }

    user.username = username;
    user.email = email;
    user.updated_at = new Date().toISOString();

    // output
    return res.json(user);
  } catch (e) {
    return next(e);
  } finally {
    log.info('PUT /api/user/:user_id', req.params, req.body);
  }
});

// DELETE /api/user/:user_id
UserRouter.delete('/api/user/:user_id', async (req, res, next) => {
  try {
    log.info('DELETE /api/user/:user_id', req.params, req.body);

    // input
    const user_id = Number(req.params.user_id);
    if (!isNumber(user_id) || !Number.isInteger(user_id)) {
      throw new Error('400 Bad Request');
    }

    // logic
    const user = UserTable.find((user) => user.user_id === user_id);
    if (!user) {
      throw new Error('404 Not Found');
    }

    UserTable.splice(
      UserTable.findIndex((user) => user.user_id === user_id),
      1,
    );

    // output
    return res.json(user);
  } catch (e) {
    return next(e);
  } finally {
    log.info('DELETE /api/user/:user_id', req.params, req.body);
  }
});

const UserTable = [
  {
    user_id: 1,
    username: 'John Smith',
    email: 'john.smith@example.com',
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 2,
    username: 'Emily Johnson',
    email: 'emily.johnson@example.org',
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 3,
    username: 'Michael Brown',
    email: 'michael.brown@example.net',
    updated_at: new Date().toISOString(),
  },
];
