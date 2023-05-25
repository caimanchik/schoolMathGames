import {FormControl} from "@angular/forms";

export type GameForm = {
  gameTitle: FormControl<string>,
  date: FormControl<string>,
  time: FormControl<string>,
  timeGame: FormControl<string>
}
