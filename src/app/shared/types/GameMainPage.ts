import {OGameType} from "./GameType";
import {OGameStatus} from "./GameStatus";

export type GameMainPage = {
  id: number,
  name: string,
  gameType: keyof typeof OGameType,
  start: string | Date,
  status: keyof typeof OGameStatus
}
