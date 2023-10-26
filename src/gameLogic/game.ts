/* 7, 8, 9, 10, J, Q, K, A
 only 32 cards
pick random dealer, then deal all cards so all players have same amount
for 3 player: 10 cards per
 4 : 7
  5: 6

place remaining cards face down on the table, these are called blind cards

 to left of dealer goes first, then proceed clock wise

Sheepshead divides the entire deck into trump cards and fail cards.
There are 14 designated trump cards.
They are are, in order of highest to lowest:

Queen of Clubs, Queen of Spades, Queen of Hearts, Queen of Diamonds
Jack of Clubs, Jack of Spades, Jack of Hearts, Jack of Diamonds
Diamond-suited cards A, 10, K, 9, 8, 7

The remaining fail cards (18 in all) are ranked slightly differently
than what most players will be familiar with. From highest to lowest:

Ace of Clubs, Ace of Spades, Ace of Hearts
Ten of Clubs, Ten of Spades, Ten of Hearts
King of Clubs, King of Spades, King of Hearts
Nine of Clubs, Nine of Spades, Nine of Hearts
Eight of Clubs, Eight of Spades, Eight of Hearts
Seven of Clubs, Seven of Spades, Seven of Hearts

the game logic:
 -  at start of hand, player can chose to pick up blind cards, doing so named them the picker
 - they get a picker puck placed under their seat to indicate this

  * after taking the blind cards, then the picker will discard 2 cards

 next the picker picks a player to combine their cards with for the score at the end of the hand
 1 The picker states that whoever holds the Jack of Diamonds is their partner. This is the most common method.
 2 The picker may name the Ace of Hearts, Ace of Clubs, or Ace of Spades and whoever holds this card becomes their partner.

 *** partners are not shared publicly

 if no one picks the cards you can do:
  1 Leaster - The person who scores the fewest points wins. There is no picker and no partners.
  2 Doubler - All of the cards are reshuffled and new hands are dealt to all players.
              There is no picker and no partners. Points lost and gained at the end of this round are doubled.

on each turn, players play a card to the center of the table following the previous cards suit if possible
person with the highest value card takes the 'trick'
'tricks' then continue until all hands are empty
you then gain or lose points
cards are shuffled and then deat again
players are then given the option to take their blind cards or to pass

player who wins the tricks begins the new trick

steps:
TAKING A TURN
Play a card onto the trick pile, matching the previously played suit if possible.
When all players have added a card, the player who placed the highest-value card takes the trick.

Combine the scores of the picker and their partner, then the scores of the other players.
If the picking team gets 61 or more card points, the picker earns 2 points and their partner earns 1.
All other players lose 1 point. Indicate this on the Player Points counter.

If the picking team earns less than 60 card points, the picker loses 2 points and their partner loses 1.
All other players will gain 1 point.

If the picking team wins and the other team doesn't earn more than 30 card points,
 double the points each player wins or loses in this round.

If the non-picking team wins and the picking team doesn't earn more than 30 points,
 double the points each player wins or loses in this round.

If the picking team takes all of the tricks and earns the full 120 points,
 they earn three times the usual points for the round, and the other team loses three times the usual points.

If the non-picking team takes all of the tricks, the picker loses three times
 the usual points and the winning team earns three times the usual points.
 Note that the picker's partner receives no penalty in this scenario.
*/

// 7, 8, 9, 10, J, Q, K, A

/*
objects for the game:

PLAYER 3-5
a player can:
have a hand of cards
give a card of that hand to the game pile
have a score
maintain an identifier that links to the cards in their hand

A GAME
can have players
can have everyones score
decides turn sequence
can store the 'team' that gets est.
Deals cards based on amount of people
creates new turn (cards on table)
calculates game scores at end of turn

*/

// class Player
import { cardComparativeValues, createDeck, shuffleDeck } from './deck';
import {
  type DeckOfCards,
  type Game,
  type GamePlayer,
  type TableCard,
  type WinningCard
} from '../types';
import { getPlayerIndex } from './gameUtil';

export function createGame(): Game {
  const game: Game = {
    players: [] as GamePlayer[],
    currentCardsOnTable: [], // this needs to include player id!!
    isStart: true, // blind shows start, redundant?
    dealer: 0,
    // this needs changed on dealer (always clockwise of dealer)
    // this also changes to reflect hand winnner
    currentPlayer: 1, // this tracks whos turn it is
    picker: '',
    secretTeam: [],
    otherTeam: [],
    blindCards: [],
    inProgress: false,
    setScoreMode: 'picker', // leastor, doubler, picker(team)
    setPlayer: (player: GamePlayer) => {
      const index = getPlayerIndex(game.players, player.id);
      if (index === -1) game.players.push(player);
    },
    removePlayer: (playerId: string) => {
      const index = getPlayerIndex(game.players, playerId);
      if (index !== -1) game.players.splice(index, 1);
      return game.players;
    },
    moveToNext: () => {
      if (game.currentPlayer !== game.players.length - 1) {
        game.currentPlayer += 1;
      } else {
        game.currentPlayer = 0;
      }
    },
    setPicker: (playerId: string) => {
      game.picker = playerId;

      const index = getPlayerIndex(game.players, playerId);
      if (game.blindCards.length > 0) {
        game.players[index].makePicker(game.blindCards);
        game.blindCards = [];
      }
    },
    setSecretAndOtherTeam: (namedCard: string) => {
      /*
       JD AH AC AS AD
       when a player picks
       1 The picker states that whoever holds the Jack of Diamonds
       is their partner. This is the most common method.
       2 The picker may name the Ace of Hearts, Ace of Clubs, or Ace of Spades
       and whoever holds this card becomes their partner.
      */
      game.players.forEach((player) => {
        if (player.id !== game.picker) {
          const inHand: boolean = player.hand.some((card) => {
            return card === namedCard;
          });
          if (inHand) {
            game.secretTeam.push(player.id);
          } else {
            game.otherTeam.push(player.id);
          }
        } else {
          // push picker to secret team
          game.secretTeam.push(player.id);
        }
      });
    },
    dealCards: () => {
      const deck = createDeck();
      const shuffledDeck: DeckOfCards = [...shuffleDeck(deck)];
      let cardCount = 0;
      const playerCount: number = game.players.length;

      if (playerCount === 3) {
        cardCount = 10;
      } else if (playerCount === 4) {
        cardCount = 7;
      }
      if (playerCount === 5) {
        cardCount = 6;
      }

      for (cardCount; cardCount > 0; cardCount--) {
        for (
          let playerCount = 0;
          playerCount < game.players.length;
          playerCount++
        ) {
          const card: string | undefined = shuffledDeck.pop();
          if (card && card !== '') {
            game.players[playerCount].hand.push(card);
          }
        }
      }

      // 4 players is the only mode where you need 4 in blind
      game.blindCards = shuffledDeck.splice(
        0,
        game.players.length === 4 ? 4 : 2
      );
    },
    tableReceiveAllCards: () => {
      game.players.forEach((p) => {
        game.currentCardsOnTable.push(p.cardToPlay);
        p.cardToPlay = {
          player: '',
          card: ''
        };
      });
    },
    calculateHandWinner: () => {
      const cards = [...game.currentCardsOnTable];
      const cleanIds: string[] = [];
      let winningCard = {} as WinningCard;
      cards.forEach((x: TableCard) => {
        const value = x.card;
        const getCardValue = cardComparativeValues[value];
        if (
          getCardValue > winningCard?.gameValue ||
          winningCard?.gameValue === undefined
        ) {
          winningCard = {
            player: x.player,
            card: value,
            gameValue: getCardValue
          };
        }
        cleanIds.push(x.card);
      });

      const winner = getPlayerIndex(game.players, winningCard.player);
      game.players[winner].wonCards.push(...cleanIds);
      game.currentCardsOnTable = [];
      // winner always starts next hand
      game.currentPlayer = winner;
    },
    calculateScore: (): void => {
      // cardValues -- dont forget that the gameMode matters with this

      // first total all players cards
      game.players.forEach((p) => {
        p.getTotalForCards();
      });

      // next set the scores based on game modes:
      if (game.setScoreMode === 'picker') {
        // add the scores of the picker and the partner:
        // const getSecretTeam = game.secretTeam.map((p:string)=> getPlayerIndex(game.players, p))
        // this returns an array of each index
        let secretTeamTotal = 0;
        let otherTeamTotal = 0;
        let pickerPoints = 2;
        let otherPoints = 1;

        const increaseValues = (val: number) => {
          pickerPoints *= val;
          otherPoints *= val;
        };

        game.players.forEach((p) => {
          if (game.secretTeam.includes(p.id)) {
            secretTeamTotal += p.wonCardsTotal;
          } else {
            otherTeamTotal += p.wonCardsTotal;
          }
        });

        // if secretTeam has more than 61 - picker gets 2 points, partner gets 1
        // all other players lose 1 point

        // if less, picker loses 2 points, partner loses 1
        // is there a way to abstract the loop, and pass in values to mess with?

        // If the picking team wins and the other
        // team doesn't earn more than 30 card points,
        // double the points each player wins or loses in this round.

        if (secretTeamTotal > 61 && secretTeamTotal < 120) {
          if (otherTeamTotal < 30) {
            increaseValues(2);
          }
        } else if (secretTeamTotal === 120 || otherTeamTotal === 120) {
          increaseValues(3);
        } else {
          if (secretTeamTotal < 30) {
            increaseValues(2);
          }
        }

        game.players.forEach((p) => {
          if (game.secretTeam.includes(p.id)) {
            if (secretTeamTotal > 61) {
              p.isPicker ? (p.score += pickerPoints) : (p.score += otherPoints);
            } else if (otherTeamTotal === 120) {
              // edge case where partner doesnt get penalty
              p.isPicker ? (p.score -= pickerPoints) : (p.score -= 1);
            } else {
              p.isPicker ? (p.score -= pickerPoints) : (p.score -= otherPoints);
            }
          } else {
            otherTeamTotal > 61
              ? (p.score += otherPoints)
              : (p.score -= otherPoints);
          }
        });
      } // else if (game.setScoreMode === 'doubler') {
      // } else if (game.setScoreMode === 'leaster') {
      // }
      // resetGameForNewTurn() ???
    },
    incrementDealer: () => {
      if (game.dealer !== game.players.length - 1) {
        game.dealer += 1;
      } else {
        game.dealer = 0;
      }
    },
    resetGameForNewRound: () => {
      game.picker = '';
      game.secretTeam = [];
      game.blindCards = [];
      game.otherTeam = [];
      game.inProgress = false;
      game.setScoreMode = 'picker';
      game.incrementDealer();
      if (game.dealer + 1 > game.players.length - 1) {
        game.currentPlayer = 0;
      } else {
        game.currentPlayer = game.dealer + 1;
      }
      // game.currentPlayer = game.dealer + 1; // needs ot be iterated
      game.currentCardsOnTable = [];
      // game.newDeck(); // should this be left for the FE?
      game.players.forEach((p) => {
        p.resetForNextRound();
      });
    },
    resetAll: () => {
      game.players.forEach((p) => {
        p.resetForNewGame();
      });
      game.resetGameForNewRound();
      game.currentPlayer = 1;
      game.dealer = 0;
    }
  };
  return game;
}
