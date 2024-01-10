import { CustomSocket } from "../../../../shared/types/essential";
import { Game } from "../../../../shared/utils/game";
import LobbyStorage from "../../LobbyStorage";
import { MazeRunnerType } from "./types/mazerunner";
import { inGame } from "./utils/user";

class MazeRunner extends Game {
  private game: MazeRunnerType;

  constructor() {
    super();

    this.game = {
      id: "MazeRunner",
      name: "Maze Runner",
      description: "A game of maze running.",
      minPlayers: 1,
      maxPlayers: 1,
      lobbyId: null,
      ownerId: null,
      players: [],
      spectators: [],
      singleplayer: true,
    };
  }

  startGame(lobbyId: string, gameId: string): void {
    this.lobbyId = lobbyId;
    this.game.lobbyId = lobbyId;

    // Get the lobby from the lobbyId and transfer the players to the game
    const lobby = LobbyStorage.getInstance().getLobbyFromId(lobbyId);
    this.game.players = lobby.users.map((user) => {
      return {
        ...user,
        dead: false,
        isFinished: false,
        position: {
          x: "0",
          y: "0",
        },
      };
    });

    this.game.ownerId = lobby.owner.id;
  }

  receiveEvent(socket: CustomSocket, data: any): void {
    // Check if the user is in the game.
    if (!inGame(socket, this.game.players)) {
      socket.emit("game", {
        type: "error",
        payload: {
          message: "You are not in the game.",
        },
      });
    }

    switch (data.type) {
      case "goal": {
        // Check the users position.
      }
    }
  }

  handleDisconnect(socket: CustomSocket): void {
    // Remove the user from the game.
    // If the user is the owner, remove the game.

    this.game.players = this.game.players.filter(
      (player) => player.id !== socket.id
    );
    console.log("User: " + socket.id + " disconnected from Maze Runner.");
  }
}

export default MazeRunner;
