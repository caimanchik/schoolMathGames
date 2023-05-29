import {OGameType} from "./GameType";
import {OGameStatus} from "./GameStatus";
import {Team} from "./Team";

export type GameMainPage = {
  id: number,
  name: string,
  type: keyof typeof OGameType,
  start: string | Date,
  status: keyof typeof OGameStatus
}

export type GameAllInfo = GameMainPage & {
  teams: Team[],
  timeGame: number
}

export type CreateGame = {
  name: string,
  type: number,
  start: number,
  timeGame: number
}

export type UpdateGame = Omit<CreateGame, 'type'> & {
  gameId: number,
}

export type UpdateGameStatus = {
  gameId: number,
  status: keyof typeof OGameStatus
}

export type DeleteGame = {
  gameId: number
}
