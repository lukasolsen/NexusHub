import { CustomSocket } from "../../../../shared/types/essential";
import { User } from "../../../../shared/types/user";
import { Game } from "../../../../shared/utils/game";
import LobbyStorage from "../../LobbyStorage";
import BoardGeneration from "./components/board";
import { Item, Monster, Player } from "./types/essential";
import { PlayerSocket } from "./types/user";

class CosmicHorrors extends Game {
  private gameId: string;
  protected lobbyId: string;

  private boardGeneration: BoardGeneration;

  constructor() {
    super();
  }

  // Handles the disconnection of a player
  handleDisconnect(socket: CustomSocket): void {
    console.log(this.users);
    const disconnectedPlayer = this.users.find(
      (player) => player.id === socket.id
    );

    if (!disconnectedPlayer) {
      return;
    }

    // Remove the disconnected player from the list
    this.users = this.users.filter((player) => player.id !== socket.id);
  }

  // Handles various events received from clients
  receiveEvent(socket: CustomSocket, data: any): void {
    console.log(data);
    switch (data.type) {
      default:
        break;
    }
  }

  // Initiates the game with the provided lobby and game IDs
  startGame(lobbyId: string, gameId: string): void {
    this.lobbyId = lobbyId;
    this.gameId = gameId;

    // Retrieve the lobby from the storage and transfer users to the game
    const lobby = LobbyStorage.getInstance().getLobbyFromId(lobbyId);
    this.users = lobby.users.map((user) => this.userToPlayer(user));

    // Generate the board
    const board = BoardGeneration.getInstance().generateLevel();
    this.sendToLobby("game", {
      type: "board",
      payload: { board: BoardGeneration.getInstance().generateBoardForLobby() },
    });
  }

  private userToPlayer(user: User): PlayerSocket {
    return {
      ...user,
      dead: false,
    };
  }
}

export default CosmicHorrors;
