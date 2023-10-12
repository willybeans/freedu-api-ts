import { type GamePlayer, type Players, type TableCard } from './players';

export interface TurnIndicatorProps {
  currentPlayer: string;
  players: string[];
}

export interface GameBoardProps {
  players: string[];
}

export interface PlayerScore {
  id: string;
  score: number;
}

export interface ScoreboardProps {
  scores: PlayerScore[];
}

export interface GameState {
  inPlay: boolean;
  shuffledDeck: string[];
  currentCardsOnTable: TableCard[];
  currentPlayer: number;
  picker: string;
  secretTeam: string[];
  otherTeam: string[];
  blindCards: string[];
  setScoreMode: 'leaster' | 'doubler' | 'picker';
}

export interface Game {
  players: GamePlayer[];
  // shuffledDeck: string[];
  currentCardsOnTable: TableCard[];
  currentPlayer: number;
  picker: string;
  secretTeam: string[];
  otherTeam: string[];
  blindCards: string[];
  setScoreMode: 'leaster' | 'doubler' | 'picker'; // is this right? picker? im not sure
  setPlayer: (player: GamePlayer) => void;
  removePlayer: (playerId: string) => Players;
  // newDeck: () => void;
  moveToNext: () => void;
  setPicker: (playerId: string) => void;
  setSecretAndOtherTeam: (namedCard: string) => void;
  dealCards: () => void;
  tableReceiveAllCards: () => void;
  calculateHandWinner: () => void;
  calculateScore: () => void;
  resetPlayersForNewTurn: () => void;
  resetGameForNewTurn: () => void;
  resetAll: () => void;
}
