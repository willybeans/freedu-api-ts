import { Messages, Users } from './models';
import { type ApiMessage, type Commands, type Game, type ParsedWebSocketContent } from './types';
import { createPlayer } from './gameLogic/players';
import { getPlayerIndex } from './gameLogic/gameUtil';

export const gameActions = async (
  gameInstance: Game,
  parsedContent: ParsedWebSocketContent,
  roomId: string
): Promise<string> => {
  const { userId, gameCommand, contentType } = parsedContent;
  let newContent;
  if (gameCommand) {
    let key = '' as Commands;
    let keys: string[];
    if (typeof gameCommand === 'object') {
      keys = Object.keys(gameCommand);
      key = keys[0] as Commands;
    } else if (typeof gameCommand === 'string') {
      key = gameCommand;
    }
    switch (key) {
      case 'setPlayer': {
        const newPlayer = createPlayer(userId);
        gameInstance.setPlayer(newPlayer);
        break;
      }
      case 'removePlayer': {
        // test this
        gameInstance.removePlayer(userId);
        break;
      }

      case 'gameStart':
        gameInstance.newDeck();
        gameInstance.dealCards();
        break;
      case 'setPicker': // test this
        gameInstance.setPicker(userId);
        break;
      case 'userPlaysCard': {
        // test this
        // gameInstance.setPicker(userId);
        const index = getPlayerIndex(gameInstance.players, userId);
        gameInstance.players[index].playCard(
          gameCommand.userPlaysCard as string
        );
        let allPlayersPlayed = true;
        gameInstance.players.forEach((p) => {
          if (p.cardToPlay.card === '') {
            allPlayersPlayed = false;
          }
        });
        if (allPlayersPlayed) {
          gameInstance.tableReceiveAllCards();
        }
        break;
      }
      case 'setSecretAndOtherTeam': // test this
        gameInstance.setSecretAndOtherTeam(gameCommand.setTeams as string);
        break;
      /* eslint-disable no-fallthrough */
      case 'calculateHandWinner':
      // gameInstance.calculateHandWinner();
      // break;
      case 'calculateScore':
      // gameInstance.calculateScore();
      // break;
      case 'resetPlayersForNewTurn':
      // gameInstance.resetPlayersForNewTurn();
      // break;
      case 'resetGameForNewTurn':
      // gameInstance.resetGameForNewTurn();
      // break;
      case 'resetAll':
        // gameInstance[key]
        // gameInstance.resetAll();
        console.log('testing fallthrough: ', key);
        gameInstance[key]();
        break;
      default:
        break;
    }

    newContent = {
      // ApiMessage
      // gameState: {
      //   players: gameInstance.players,
      //   shuffledDeck: gameInstance.shuffledDeck,
      //   currentCardsOnTable: gameInstance.currentCardsOnTable,
      //   currentPlayer: gameInstance.currentPlayer,
      //   picker: gameInstance.picker,
      //   secretTeam: gameInstance.secretTeam,
      //   otherTeam: gameInstance.otherTeam,
      //   blindCards: gameInstance.blindCards,
      //   setScoreMode: gameInstance.setScoreMode
      // },
      gameInstance,
      gameCommand,
      userId,
      contentType,
      roomId
      // user_name: getUser?.username ?? ''
    };
  }

  let finalContent = '';
  try {
    finalContent = JSON.stringify(newContent);
  } catch (e) {
    console.error('stringify failed in chat module', e);
  }
  return finalContent;
};

export const chatActions = async (
  parsedContent: ParsedWebSocketContent,
  roomId: string
): Promise<string> => {
  const { userId, chatMessage = '', contentType } = parsedContent;

  const addMessage = await Messages.addMessage(userId, roomId, chatMessage);
  const getUser = await Users.getUser(userId);

  const newContent: ApiMessage = {
    ...addMessage,
    contentType,
    user_name: getUser?.username ?? ''
  };

  let finalContent = '';
  try {
    finalContent = JSON.stringify(newContent);
  } catch (e) {
    console.error('stringify failed in chat module', e);
  }
  return finalContent;
};
