import {OGameType} from "../GameType";

export type ChangeScoreTeam = {
  teamId: number,
  exercise: number,
  value: string | number
}

export type ChangeScoreGame = {
  gameId: number,
  gameType: keyof typeof OGameType
  changeScores: ChangeScoreTeam[]
}
