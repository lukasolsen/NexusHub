import { GameType } from "./game";
import { User } from "./user";

export interface Lobby {
  id: string;

  owner: User;
  users: User[];

  game: string;
  gameId: string;

  games?: string[];
}
