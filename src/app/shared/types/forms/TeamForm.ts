import {FormControl} from "@angular/forms";

export type TeamForm = {
  [K in number]: FormControl<string>
}
