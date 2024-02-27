import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { env } from '~/lib/env';
import { log } from '~/lib/log4js';

/**
 * https://github.com/microsoft/TypeScript-Node-Starter/blob/master/src/types/express-session-types.d.ts
 *
 * Naming this file express-session.d.ts causes imports from "express-session"
 * to reference this file and not the node_modules package.
 */
declare module 'express-session' {
  interface SessionData {
    username: string;
  }
}

// node_modules/@types/express-session/index.d.ts
declare module 'http' {
  interface IncomingMessage {
    session: session.Session & Partial<session.SessionData>;
    sessionID: string;
  }
}

const app = express();
const server = createServer(app);
const io = new Server(server);

// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(helmet());

app.set('trust proxy', 1); // trust first proxy

const SessionMiddleware = session({
  secret: env.session.SESSION_SECRET,
  name: env.session.SESSION_NAME,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 /*ms*/,
    httpOnly: true,
    domain: env.session.SESSION_DOMAIN,
    path: env.session.SESSION_PATH,
    secure: env.PROD,
  },
  resave: false,
  saveUninitialized: true,
});
app.use(SessionMiddleware);
io.engine.use(SessionMiddleware);

const nsp = io.of('/socket.io');

app.get('/', (req, res) => {
  res.json({ id: req.sessionID, username: req.session.username });
});

nsp.on('connection', (socket) => {
  const req = socket.request;

  log.info('connection', req.sessionID, socket.id);

  nsp.to(socket.id).emit('event', { id: req.sessionID, username: req.session.username });

  socket.on('disconnect', (reason) => {
    log.info('disconnect', req.sessionID, socket.id, reason); // the Set contains at least the socket ID
  });
});

server.on('error', (err) => {
  log.error('Error opening server', err);
});

server.listen(env.PORT, () => {
  log.info(`App is running at http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});
