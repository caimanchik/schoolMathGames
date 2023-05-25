import {OGameType} from "./GameType";
import {OGameStatus} from "./GameStatus";
import {Team} from "./Team";

export type GameMainPage = {
  id: number,
  name: string,
  gameType: keyof typeof OGameType,
  start: string | Date,
  status: keyof typeof OGameStatus
}

export type GameAllInfo = GameMainPage & {
  teams: Team[],
  timeGame: number
}

export type CreateGame = {
  name: string,
  gameType: number,
  start: number,
  timeGame: number
}

export type UpdateGameStatus = {
  id: number,
  status: keyof typeof OGameStatus
}

export type DeleteGame = {
  id: number
}
