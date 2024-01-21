import SocketManager from "../../socket-server/src/SocketManager";
import turnToUser from "../../socket-server/src/utils/user";
import { CustomSocket } from "../types/essential";
import { User } from "../types/user";

export abstract class Game {
  protected lobbyId: string;
  protected users: User[];

  abstract startGame(lobbyId: string, gameId: string): void;
  abstract receiveEvent(socket: CustomSocket, payload: any): void;
  abstract handleDisconnect(socket: CustomSocket): void;

  protected sendToLobby(event: string, payload: any): void {
    const io = SocketManager.getInstance().getIO();

    io.to(this.lobbyId).emit(event, payload);
  }

  protected sendToPlayer(
    event: string,
    payload: any,
    socket: CustomSocket
  ): void {
    socket.emit(event, payload);
  }

  protected handlePlayerJoin?(socket: CustomSocket): void {
    // Handle basic checks, such as if the player is already in the game
    const user = this.users.find((user) => user.id === socket.id);
    if (user) {
      return;
    }

    this.users.push(turnToUser(socket));
  }

  protected handlePlayerLeave?(socket: CustomSocket): void {
    // Handle basic checks, such as if the player is already in the game
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      return;
    }

    this.users = this.users.filter((user) => user.id !== socket.id);
  }

  protected isUserConnected(userId: string): boolean {
    const socket = SocketManager.getInstance().getSocket(userId as string);

    return !!socket;
  }
}
