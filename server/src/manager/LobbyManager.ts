// server/LobbyManager.ts
import { Server } from "socket.io";
import { Lobby } from "../../../shared/types/lobby";
import { generateServerId, generateUserId } from "../utils/id";
import { CustomSocket } from "../../../shared/types/essential";
import turnToUser from "../utils/user";
import GameManager from "./GameManager";
import SocketManager from "../SocketManager";
import LobbyStorage from "../LobbyStorage";

class LobbyManager {
  private leaveLobby(socket: CustomSocket): void {
    const lobby = LobbyStorage.getInstance().getLobbies().get(socket.id);

    if (lobby) {
      socket.leave(lobby.id);
      lobby.users = lobby.users.filter((user) => user.id !== socket.id);

      const io = SocketManager.getInstance().getIO();
      io.to(lobby.id).emit("lobby", {
        type: "disconnect",
        payload: lobby,
      });

      io.to(socket.id).emit("lobby", {
        type: "disconnected",
        payload: lobby,
      });

      if (lobby.owner.id === socket.id && lobby.users.length > 0) {
        lobby.owner = lobby.users[0];
      } else if (lobby.owner.id === socket.id && lobby.users.length === 0) {
        LobbyStorage.getInstance().removeLobby(lobby.id);
      }
    }
  }

  private startGame(socket: CustomSocket, data: { game: string }): void {
    const lobby = LobbyStorage.getInstance().getLobbiesFromSocket(socket);
    if (lobby) {
      lobby.gameId = generateUserId();

      const allowedGames = ["TwistedShadows", "MazeRunner"];
      if (!allowedGames.includes(data.game)) {
        return;
      }

      lobby.game = data.game;

      const io = SocketManager.getInstance().getIO();

      io.to(lobby.id).emit("lobby", {
        type: "start",
        payload: lobby,
      });

      GameManager.getInstance(io).startGame(lobby.id, lobby.game, lobby.gameId);
    }
  }

  private joinLobby(socket: CustomSocket, data: any): void {
    const lobby = LobbyStorage.getInstance().getLobbies().get(data.payload.id);

    if (lobby) {
      socket.role = "user";
      socket.join(lobby.id);
      lobby.users.push(turnToUser(socket));
      const io = SocketManager.getInstance().getIO();
      lobby.games = GameManager.getInstance(io).getGames();

      io.to(lobby.id).emit("lobby", {
        type: "join",
        payload: lobby,
      });
    }
  }

  public createAndJoinLobby(socket: CustomSocket): void {
    const lobby = LobbyStorage.getInstance().createLobby(socket);

    socket.join(lobby.id);
    console.log("User - " + socket.id + " created lobby - " + lobby.id);
    const io = SocketManager.getInstance().getIO();

    lobby.games = GameManager.getInstance(io).getGames();

    socket.emit("lobby", {
      type: "create",
      payload: lobby,
    });
  }

  public handleLobbyAction(socket: CustomSocket, data: any): void {
    switch (data.type) {
      case "create":
        this.createAndJoinLobby(socket);
        break;
      case "join":
        this.joinLobby(socket, data);
        break;
      case "start":
        this.startGame(socket, data);
        break;
      case "disconnect":
        this.leaveLobby(socket);
        break;
    }
  }
}

export default LobbyManager;
