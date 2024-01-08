import { CustomSocket } from "../types/essential";

export abstract class Game {
  protected lobbyId: string;

  abstract startGame(lobbyId: string, gameId: string): void;
  abstract receiveEvent(socket: CustomSocket, payload: any): void;
  abstract handleDisconnect(socket: CustomSocket): void;
  // Add more game-related methods as needed
}
