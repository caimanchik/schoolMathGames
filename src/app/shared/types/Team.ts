export type Team = {
  teamId: number,
  name: string,
  sumScore: number,
  scores: number[]
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
