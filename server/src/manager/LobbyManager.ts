import { generateUserId } from "../utils/id";
import turnToUser from "../utils/user";
import GameManager from "./GameManager";
import SocketManager from "../SocketManager";
import LobbyStorage from "../LobbyStorage";
import { CustomSocket } from "../../../shared/types/essential";

class LobbyManager {
  private leaveLobby(socket: CustomSocket): void {
    const lobby = LobbyStorage.getInstance().getLobbiesFromSocketID(socket.id);

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

      const allowedGames = GameManager.getInstance().getGames();
      if (!allowedGames.includes(data.game)) {
        return;
      }

      lobby.game = data.game;

      const io = SocketManager.getInstance().getIO();

      io.to(lobby.id).emit("lobby", {
        type: "start",
        payload: lobby,
      });

      GameManager.getInstance().startGame(lobby.id, lobby.game, lobby.gameId);
    }
  }

  private joinLobby(socket: CustomSocket, data: any): void {
    const lobby = LobbyStorage.getInstance().getLobbies().get(data.lobbyId);

    if (lobby) {
      socket.role = "user";
      socket.join(lobby.id);
      lobby.users.push(turnToUser(socket));
      const io = SocketManager.getInstance().getIO();
      lobby.games = GameManager.getInstance().getGames();

      io.to(lobby.id).emit("lobby", {
        type: "join",
        payload: lobby,
      });
    } else {
      socket.emit("lobby", {
        type: "error",
        payload: "No lobby found",
      });
    }
  }

  public createAndJoinLobby(socket: CustomSocket): void {
    const lobby = LobbyStorage.getInstance().createLobby(socket);

    socket.join(lobby.id);
    console.log("User - " + socket.id + " created lobby - " + lobby.id);
    const io = SocketManager.getInstance().getIO();

    lobby.games = GameManager.getInstance().getGames();

    socket.emit("lobby", {
      type: "create",
      payload: lobby,
    });
  }

  public giveOwner(socket: CustomSocket, data: any): void {
    const lobby = LobbyStorage.getInstance().getLobbiesFromSocketID(socket.id);

    if (lobby) {
      console.log(data);
      console.log(
        "User - " + socket.id + " gave owner to - " + data.payload.userId
      );
      const newUser = LobbyStorage.getInstance().findUserFromLobby(
        lobby.id,
        data.payload.userId
      );
      if (!newUser) {
        socket.emit("lobby_error", {
          type: "error",
          payload: "No user found",
        });
        return;
      }

      lobby.owner = newUser;

      lobby.users = lobby.users.map((user) => {
        if (user.id === newUser.id) {
          user.role = "owner";
        } else {
          user.role = "user";
        }
        return user;
      });

      const io = SocketManager.getInstance().getIO();

      const newUserSocket = io.sockets.sockets.get(newUser.id) as CustomSocket;
      newUserSocket.role = "owner";
      socket.role = "user";

      io.to(lobby.id).emit("lobby", {
        type: "giveOwner",
        payload: lobby,
      });
    } else {
      socket.emit("lobby_error", {
        type: "error",
        payload: "No lobby found",
      });
    }
  }

  public banPlayer(socket: CustomSocket, data: any): void {
    const lobby = LobbyStorage.getInstance().getLobbiesFromSocketID(socket.id);

    if (lobby) {
      console.log(data);
      console.log("User - " + socket.id + " banned - " + data.payload.userId);
      const newUser = LobbyStorage.getInstance().findUserFromLobby(
        lobby.id,
        data.payload.userId
      );
      if (!newUser) {
        socket.emit("lobby_error", {
          type: "error",
          payload: "No user found",
        });
        return;
      }

      lobby.bannedUsers.push(newUser.id);

      lobby.users = lobby.users.filter((user) => user.id !== newUser.id);

      const io = SocketManager.getInstance().getIO();
      io.to(lobby.id).emit("lobby", {
        type: "banPlayer",
        payload: lobby,
      });

      const newUserSocket = io.sockets.sockets.get(newUser.id);

      this.leaveLobby(newUserSocket as CustomSocket);
    } else {
      socket.emit("lobby_error", {
        type: "error",
        payload: "No lobby found",
      });
    }
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
      case "getPublicLobbies":
        const lobbies = LobbyStorage.getInstance().getPublicLobbies();
        socket.emit("lobby", {
          type: "getPublicLobbies",
          payload: lobbies,
        });
        break;

      case "giveOwner": {
        if (socket.role !== "owner") {
          return;
        }

        this.giveOwner(socket, data);
        break;
      }

      case "kickUser": {
        if (socket.role !== "owner") {
          return;
        }

        const lobby = LobbyStorage.getInstance().getLobbiesFromSocketID(
          socket.id
        );

        if (!lobby) {
          socket.emit("lobby_error", {
            type: "error",
            payload: "No lobby found",
          });

          return;
        }

        const user = lobby.users.find(
          (user) => user.id === data.payload.userId
        );
        if (!user) {
          socket.emit("lobby_error", {
            type: "error",
            payload: "No user found",
          });

          return;
        }

        const io = SocketManager.getInstance().getIO();

        io.to(user.id).emit("lobby", {
          type: "kickUser",
          payload: lobby,
        });

        const newUserSocket = io.sockets.sockets.get(user.id);

        this.leaveLobby(newUserSocket as CustomSocket);
        break;
      }

      case "banUser": {
        if (socket.role !== "owner") {
          console.log("Not owner");
          return;
        }

        this.banPlayer(socket, data);
        break;
      }

      case "settings": {
        if (socket.role !== "owner") {
          return;
        }

        const lobby = LobbyStorage.getInstance().getLobbiesFromSocketID(
          socket.id
        );

        if (lobby) {
          const io = SocketManager.getInstance().getIO();

          const requiredFields = ["isPublic"];
          for (const field of requiredFields) {
            if (data.payload[field] === undefined) {
              socket.emit("lobby_error", {
                type: "error",
                payload: `Missing field ${field}`,
              });
              return;
            }
          }

          lobby.isPublic = data.payload.isPublic;

          io.to(lobby.id).emit("lobby", {
            type: "settings",
            payload: lobby,
          });
        }
        break;
      }
    }
  }

  public handleDisconnect(socket: CustomSocket): void {
    this.leaveLobby(socket);
  }
}

export default LobbyManager;
