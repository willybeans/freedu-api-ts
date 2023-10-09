import * as ws from 'ws';
import { type Request } from 'express';
import { type Socket } from 'net';
import { Games, Messages, Users } from './models';

interface ExtWebSocket extends ws.WebSocket {
  isAlive: boolean;
  roomId: string;
}

type Sockets = Record<string, ws.WebSocketServer>;

function createSockets(id: string, newSocket: ws.WebSocketServer) {
  newSocket.on('connection', function connection(ws: ExtWebSocket) {
    function heartbeat() {
      ws.isAlive = true;
    }

    ws.roomId = id;
    ws.isAlive = true;
    ws.on('error', console.error);
    ws.on('pong', () => {
      heartbeat();
    });

    ws.on('message', async (data: ws.RawData, isBinary) => {
      const message = isBinary ? data : data.toString();
      interface parsed {
        userId: string;
        content: string;
        contentType: 'chat' | 'game';
      }
      let parse = {} as parsed;
      if (typeof message === 'string') {
        try {
          parse = JSON.parse(message);
        } catch (e) {
          console.error('parse failed:', e);
        }
      }
      /*
      all messages must contain proper body content
      {
      "userId": <uuid>/string,
      "content": string,
      "contentType": chat | game,
      }
      */

      interface ApiMessage {
        chat_room_id?: string;
        user_name?: string;
        user_id?: string;
        content?: string;
        id?: string;
        sent_at?: string;
        contentType: 'chat' | 'game';
      }

      const { userId, content, contentType } = parse;

      let getUser;
      let addMessage;
      if (contentType === 'chat') {
        addMessage = await Messages.addMessage(userId, ws.roomId, content);
        getUser = await Users.getUser(userId);
      }
      const newContent: ApiMessage = {
        ...addMessage,
        contentType,
        user_name: getUser?.username ?? ''
      };

      let finalContent: string;
      try {
        finalContent = JSON.stringify(newContent);
      } catch (e) {
        console.error('stringify failed in chat', e);
      }

      newSocket.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(finalContent);
        }
      });
    });

    ws.on('close', () => {
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

export async function upgradeConnection(
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
