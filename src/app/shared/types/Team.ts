export type Team = {
  id: number,
  name: string,
  sumScore: number,
  scores: Scores
}

export type Scores = {
  [K in number]: string
}

let a: Team = {
  id: 1,
  name: '',
  sumScore: 1,
  scores: {
    1: '',
    2: ''
  }
}

export type CreateTeam = {
  name: string,
  gameId: number
}

export type UpdateTeam = CreateTeam & {
  teamId: number,
}

export type DeleteTeam = {
  gameId: number,
  teamId: number
}
