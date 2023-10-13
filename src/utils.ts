import { Messages, Users } from './models';
import {
  type ApiMessage,
  type Commands,
  type Game,
  type ParsedWebSocketContent
} from './types';
import { createPlayer } from './gameLogic/players';
import { getPlayerIndex } from './gameLogic/gameUtil';

export const gameActions = async (
  gameInstance: Game,
  parsedContent: ParsedWebSocketContent,
  roomId: string
): Promise<string> => {
  const { userId, gameCommand, contentType } = parsedContent;
  let newContent;
  /*
    gameCommand can be 1 or 2:
    1 - gameCommand: <Commands>
    2 - gameCommand: { <Commands>: value<string>}
  */
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
        gameInstance.removePlayer(userId);
        break;
      }
      case 'gameStart': {
        gameInstance.dealCards();
        break;
      }
      case 'setPickerAndTeams': {
        gameInstance.setPicker(userId);
        gameInstance.setSecretAndOtherTeam(
          gameCommand.setPickerAndTeams as string
        );
        break;
      }
      case 'userPlaysCard': {
        const previousPlayer = gameInstance.currentPlayer;
        const index = getPlayerIndex(gameInstance.players, userId);
        gameInstance.players[index].playCard(
          gameCommand.userPlaysCard as string
        );
        gameInstance.moveToNext();

        if (gameInstance.currentPlayer < previousPlayer) {
          // on last player move
          gameInstance.tableReceiveAllCards();
          // may be better ui to have this be its own request
          gameInstance.calculateHandWinner();
        }
        break;
      }
      /* eslint-disable no-fallthrough */
      case 'calculateScore':
      case 'resetPlayersForNewTurn':
      case 'resetGameForNewTurn':
      case 'resetAll':
        console.log('testing fallthrough: ', key);
        gameInstance[key]();
        break;
      default:
        break;
    }

    newContent = {
      gameInstance,
      gameCommand,
      userId,
      contentType,
      roomId
    };
  }

  let finalContent = '';
  try {
    // stringify removes all functions!
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
