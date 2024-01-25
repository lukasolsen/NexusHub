import { CustomSocket } from "../../../types/essential";
import { Game } from "../../../utils/game";

class ExampleGame extends Game {
  private gameId: string;
  protected lobbyId: string;

  constructor() {
    super();
  }

  handleDisconnect(socket: CustomSocket): void {
    this.users = this.users.filter((player) => player.id !== socket.id);
  }

  receiveEvent(socket: CustomSocket, data: any): void {
    switch (data.type) {
      default:
        break;
    }
  }

  startGame(lobbyId: string, gameId: string): void {
    this.lobbyId = lobbyId;
    this.gameId = gameId;
  }
}

export default ExampleGame;
