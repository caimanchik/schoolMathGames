export type Team = {
  id: number,
  name: string,
  sumScore: number,
  scores: string[]
}

// export type Scores = {
//   [K in number]: string
// }

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
