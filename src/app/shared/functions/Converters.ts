import {OGameType} from "../types/GameType";
import {GameExercises} from "./GameExercises";

export class Converters {

  public static convertResponse(input: string, gameType: keyof typeof OGameType, isAdmin: boolean = false, i: number = 0): string {
    if (gameType == 2)
      return isAdmin ? this.convertDominoAdmin(input) : this.convertDominoUser(input, i)

    return ''
  }

  public static convertToDb(input: string, gameType: keyof typeof OGameType, i: number = 0) {
    if (gameType == 2)
      return this.convertDominoDb(input)

    return 0
  }

  private static convertDominoDb(input: string): number {
    if (input == 'р1')
      return -1
    if (input == 'р2')
      return -2

    return parseInt(input)
  }

  private static convertDominoUser(input: string, i: number): string {
    let intInput = parseInt(input)

    if (intInput == 0)
      return '0'
    if (intInput == 1 || intInput == 2)
      return ' '

    if (i == 0)
      return '10'

    let el = GameExercises.getDomino(i).split('-').map(e => parseInt(e))

    if (intInput == -1)
      return (el[0] + el[1]).toString()

    return Math.max(...el).toString()
  }

  private static convertDominoAdmin(input: string): string {
    let intInput = parseInt(input)

    if (intInput == 2)
      return '2'
    if (intInput == 1)
      return '1'
    if (intInput == 0)
      return '0'
    if (intInput == -1)
      return 'р1'

    return 'р2'
  }
}
