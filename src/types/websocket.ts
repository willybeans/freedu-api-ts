export type Commands =
  | 'setPlayer'
  | 'removePlayer'
  | 'userPlaysCard'
  | 'gameStart'
  | 'gameResetAll'
  | 'setPickerAndTeams'
  | 'gameCalculateScores'
  | 'setTeams'
  | 'setSecretAndOtherTeam'
  | 'calculateHandWinner'
  | 'calculateScore'
  | 'resetPlayersForNewTurn'
  | 'resetGameForNewTurn'
  | 'resetAll';

// type CommandContents = {
//   seatNumber?: number;
//   userPlaysCard?: string;
//   userId?: string;
//   card?: string;
// };

type GameCommands = {
  [key in Commands]: string | number;
};

export interface ParsedWebSocketContent {
  userId: string;
  chatMessage?: string;
  gameCommand?: GameCommands;
  contentType: 'chat' | 'game';
}

export interface ChatProps {
  messages: Messages;
}

export type Messages = Record<string, string>;

export interface ApiMessage {
  chat_room_id: string;
  user_name: string;
  user_id: string;
  content: string;
  id: string;
  sent_at: string;
  contentType: 'chat' | 'game';
}

export interface MessageBody {
  time: string;
  name: string;
  content: string;
}

export type ChatFeed = MessageBody[];

export type WebSocketSend = (
  data: string | ArrayBufferLike | Blob | ArrayBufferView
) => void;
