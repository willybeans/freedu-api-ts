import * as ws from 'ws';
import { type Request } from 'express';
import { type Socket } from 'net';
import { Games } from './models';

interface ExtWebSocket extends ws.WebSocket {
  isAlive: boolean;
}

type Sockets = Record<string, ws.WebSocketServer>;

function createSockets (id: string, newSocket: ws.WebSocketServer) {
  newSocket.on('connection', function connection (ws: ExtWebSocket) {
    function heartbeat () {
      ws.isAlive = true;
    }

    ws.isAlive = true;
    ws.on('error', console.error);
    ws.on('pong', () => {
      heartbeat();
    });

    ws.on('message', function (data, isBinary) {
      ws.send(data);
      newSocket.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on('close', function () {
      ws.send('closed');
      clearInterval(interval);
    });
  });

  const interval = setInterval(() => {
    newSocket.clients.forEach((ws) => {
      // due to ws library being a class, not an interface
      // we have to hack the type
      const wsx = ws as ExtWebSocket;
      if (!wsx.isAlive) {
        wsx.terminate();
        return;
      }

      wsx.isAlive = false;
      wsx.ping();
    });
  }, 30000);
}

const socketStore: Sockets = {};

export async function upgradeConnection (
  request: Request,
  socket: Socket,
  head: Buffer
) {
  const pathContent = request.url.split('/');
  const id = pathContent[2];
  // confirm base path before query
  if (pathContent[1] === 'games') {
    // if game id isnt in db then terminate
    const findGame = await Games.getGame(id);
    if (findGame !== undefined) {
      if (
        socketStore[id] === undefined &&
        Object.keys(socketStore).length <= 5
      ) {
        socketStore[id] = new ws.WebSocketServer({ noServer: true });
        createSockets(id, socketStore[id]);
      }
      socketStore[id].handleUpgrade(request, socket, head, (ws) => {
        socketStore[id].emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  } else {
    socket.destroy();
  }
}
