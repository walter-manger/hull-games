export type Game = {
  created: number,
  name: string,
  started: boolean,
  cards?: { [k: string]: string }, // imgId / "userid:description"
  players?: { [k: string]: string }, // ID / Name
};

export type Player = {
  id: string,
  name: string,
};

export type Selection = {
  user?: Player,
  id?: string,
  imgUrl?: string,
  description?: string,
};
