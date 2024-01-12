import { Server } from "socket.io";
import { Lobby } from "../../shared/types/lobby";
import { CustomSocket } from "../../shared/types/essential";
import turnToUser from "./utils/user";
import { generateServerId } from "./utils/id";
import { User } from "../../shared/types/user";

class LobbyStorage {
  private static instance: LobbyStorage | null = null;
  private lobbies: Map<string, Lobby> = new Map();

  private constructor() {
    // Prevent external instantiation
  }

  public static getInstance(): LobbyStorage {
    if (!LobbyStorage.instance) {
      LobbyStorage.instance = new LobbyStorage();
    }
    return LobbyStorage.instance;
  }

  public getPublicLobbies(): Lobby[] {
    return Array.from(this.lobbies.values()).filter((lobby) => lobby.isPublic);
  }

  public createLobby(socket: CustomSocket): Lobby {
    socket.role = "owner";

    const newUser = turnToUser(socket);

    const lobby: Lobby = {
      id: generateServerId(),
      owner: newUser,
      users: [newUser],
      game: "TwistedShadows",
      gameId: null,
      isPublic: false,
      name: newUser.name + "'s Lobby",
      bannedUsers: [],
    };

    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  public joinLobby(socket: CustomSocket, lobbyId: string): Lobby | undefined {
    const lobby = this.lobbies.get(lobbyId);

    if (lobby) {
      socket.role = "user";
      socket.join(lobby.id);

      const newUser = turnToUser(socket);
      lobby.users.push(newUser);

      const io = socket["server"];
      io.to(lobby.id).emit("lobby", {
        type: "connect",
        payload: lobby,
      });

      io.to(socket.id).emit("lobby", {
        type: "connected",
        payload: lobby,
      });
    }

    return lobby;
  }

  public getLobbyFromId(lobbyId: string): Lobby | undefined {
    return this.lobbies.get(lobbyId);
  }

  public removeLobby(lobbyId: string): void {
    this.lobbies.delete(lobbyId);
  }

  public findUserFromLobby(lobbyId: string, userId: string): User | undefined {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      return lobby.users.find((user) => user.id === userId);
    }
  }

  public getLobbiesFromSocket(socket: CustomSocket): Lobby {
    return Array.from(socket.rooms)
      .map((roomId) => this.lobbies.get(roomId))
      .filter((lobby) => lobby !== undefined)[0];
  }

  public getLobbiesFromSocketID(socketId: string): Lobby {
    return Array.from(this.lobbies.values())
      .filter((lobby) => lobby.users.map((user) => user.id).includes(socketId))
      .filter((lobby) => lobby !== undefined)[0];
  }

  public getLobbies(): Map<string, Lobby> {
    return this.lobbies;
  }
}

export default LobbyStorage;
