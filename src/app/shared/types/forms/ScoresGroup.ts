import {FormArray, FormControl, FormGroup} from "@angular/forms";

export type ScoreGroup = {
  score: FormControl<string>
}

export type TeamGroup = {
  scores: FormArray<FormGroup<ScoreGroup>>
}

export type TeamsScoresGroup = {
  teams: FormArray<FormGroup<TeamGroup>>
}
