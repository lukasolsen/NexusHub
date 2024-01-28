import { User } from "./user";

export interface Lobby {
  id: string;
  name: string;

  owner: User;
  users: User[];

  game: string;
  gameId: string;
  gameDataId: string;
  gameData: {
    name: string;
    description: string;
    main: string;
    client?: string;
    file: string;
  };

  isPublic: boolean;

  bannedUsers: string[];
}
