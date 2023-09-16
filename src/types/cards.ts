export type Cards = Record<string, string>;

export type Values = Record<string, number>;

export type DeckOfCards = string[];

export type CardValues =
  | '7'
  | '8'
  | '9'
  | '10'
  | 'jack'
  | 'queen'
  | 'king'
  | 'ace';

export type CardSuites = 'clubs' | 'spades' | 'hearts' | 'diamonds';

export interface CardProps {
  card: string;
  cardClick?: (card: string) => void;
}

export interface PlayerHandProps {
  hand: string[];
  playCard: (card: string) => void;
}
