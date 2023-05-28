import {OGameType} from "../types/GameType";

export class GameExercises {

  public static getCountExercises(gameType: keyof typeof OGameType) {
    if (gameType == 2)
      return 28

    return 0
  }

  public static getExercises(gameType: keyof typeof OGameType): string[] {
    let result: string[] = []
    if (gameType == 2) {
      for (let i = 0; i < this.getCountExercises(gameType); i++)
        result.push(this.getDomino(i))
    }

    return result
  }

  public static getDomino(i: number) {
    if (0 <= i && i <= 6)
      return `0-${i}`
    else if (7 <= i && i <= 12)
      return `1-${i % 6}`
    else if (13 <= i && i <= 17)
      return `2-${i % 12 + 1}`
    else if (18 <= i && i <= 21)
      return `3-${i % 17 + 2}`
    else if (22 <= i && i <= 24)
      return `4-${i % 21 + 3}`
    else if (25 <= i && i <= 26)
      return `5-${i % 24 + 4}`

    return '6-6'
  }
}
