import { GameType } from "./game";
import { User } from "./user";

export interface Lobby {
  id: string;
  name: string;

  owner: User;
  users: User[];

  game: string;
  gameId: string;

  games?: string[];

  isPublic: boolean;

  bannedUsers: string[];
}
