import { User } from "./user";

export interface Lobby {
  id: string;
  name: string;

  owner: User;
  users: User[];

  game: string;
  gameId: string;
  gameData: {
    name: string;
    description: string;
    main: string;
    client?: string;
    file: string; 
  };

  games?: string[];

  isPublic: boolean;

  bannedUsers: string[];
}
