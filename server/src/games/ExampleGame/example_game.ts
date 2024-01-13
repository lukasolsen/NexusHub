import { CustomSocket } from "../../../../shared/types/essential";
import { User } from "../../../../shared/types/user";
import { Game } from "../../../../shared/utils/game";
import LobbyStorage from "../../LobbyStorage";

class ExampleGame extends Game {
  private gameId: string;
  protected lobbyId: string;

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

  // Handles chat messages from a player
  handleChatMessage(socket: CustomSocket, data: any): void {
    if (!data.message || !socket) {
      return;
    }

    const sender = this.users.find((player) => player.id === socket.id);

    const newMessage = `${sender.name}: ${data.message}`;

    // Broadcast the chat message to the lobby
    this.sendToLobby("message", { payload: { message: newMessage } });
  }

  // Handles various events received from clients
  receiveEvent(socket: CustomSocket, data: any): void {
    console.log(data);
    switch (data.type) {
      case "chat_message":
        this.handleChatMessage(socket, data.payload);
        break;
      // Add more cases for different event types as needed
    }
  }

  // Assigns random names to players
  assignRandomNames(): void {
    const availableNames = ["Jeff", "John", "Bob", "Fatman", "Lukas"];

    this.users.forEach((player) => {
      player.name =
        availableNames[Math.floor(Math.random() * availableNames.length)];
    });
  }

  // Initiates the game with the provided lobby and game IDs
  startGame(lobbyId: string, gameId: string): void {
    this.lobbyId = lobbyId;
    this.gameId = gameId;

    // Retrieve the lobby from the storage and transfer users to the game
    const lobby = LobbyStorage.getInstance().getLobbyFromId(lobbyId);
    this.users = lobby.users.map((user) => ({ ...user, dead: false }));

    this.assignRandomNames();
  }
}

export default ExampleGame;
