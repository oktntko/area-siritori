import { io } from 'socket.io-client';

export const socket = io('/socket.io', {
  autoConnect: false,
});

export default io;
