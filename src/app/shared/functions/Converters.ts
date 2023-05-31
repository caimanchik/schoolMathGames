import {OGameType} from "../types/GameType";
import {GameExercises} from "./GameExercises";

export class Converters {

  public static convertResponse(input: number, gameType: keyof typeof OGameType, isAdmin: boolean = false, i: number = 0): string {

    if (gameType == 0)
      return isAdmin ? this.convertAbakaAdmin(input) : this.convertAbakaUser(input, i)

    if (gameType == 1)
      return isAdmin ? this.convertBonusAdmin(input) : this.convertBonusUser(input, i)

    if (gameType == 2)
      return isAdmin ? this.convertDominoAdmin(input) : this.convertDominoUser(input, i)

    return ''
  }

  public static convertToDb(input: string, gameType: keyof typeof OGameType) {
    if (gameType == 0)
      return this.convertAbakaDb(input)

    if (gameType == 1)
      return this.convertBonusDb(input)

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

  private static convertBonusDb(input: string): number {
    if (input == '-')
      return -1

    return parseInt(input)
  }

  private static convertAbakaDb(input: string): number {
    if (input == '-')
      return -1

    return parseInt(input)
  }

  private static convertAbakaUser(input: number, i: number): string {
    if (input < 0)
      return ''
    if (input == 0)
      return '0'

    return ((i % 6 + 1) * 10).toString()
  }

  private static convertAbakaAdmin(input: number): string {
    if (input < 0)
      return '-'

    return input.toString()
  }

  private static convertBonusUser(input: number, i: number): string {
    let score = Math.floor(i / 8) + 3

    if (input == 0)
      return '0'

    if (1 <= input && input <= 3)
      return (score + input).toString()

    if (4 <= input && input <= 6)
      return (score * (input - 2)).toString()

    return ''
  }

  private static convertBonusAdmin(input: number): string {
    if (input < 0)
      return '-'

    return input.toString()
  }

  private static convertDominoUser(input: number, i: number): string {
    let el = GameExercises.getDomino(i).split('-').map(e => parseInt(e))

    if (input == 0)
      return (-Math.min(...el)).toString()

    if (input == 1 || input == 2)
      return ''

    if (i == 0)
      return '10'

    if (input == -1)
      return (el[0] + el[1]).toString()

    return Math.max(...el).toString()
  }

  private static convertDominoAdmin(input: number): string {
    if (input == 2)
      return '2'
    if (input == 1)
      return '1'
    if (input == 0)
      return '0'
    if (input == -1)
      return 'р1'

    return 'р2'
  }
}
