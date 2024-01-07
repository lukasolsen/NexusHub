import { CustomSocket } from "./essential";

export interface GameType {
  id: string;
  name: string; // The name of the game (e.g. "Chess")
  description: string; // A short description of the game
  minPlayers: number; // The minimum number of players required to play the game
  maxPlayers: number; // The maximum number of players allowed to play the game

  // The game's lobby
  lobbyId: string; // The ID of the lobby that the game is played in

  // The game's players
  players: any[]; // The players in the game
  spectators: any[]; // The spectators in the game
  ownerId: string; // The owner of the game

  // Game Options
  singleplayer: boolean; // Whether or not the game can be played by one player
}
