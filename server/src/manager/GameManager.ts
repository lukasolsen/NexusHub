// server/GameManager.ts
import { Server, Socket } from "socket.io";
import * as fs from "fs";
import * as path from "path";
import { CustomSocket } from "../../../shared/types/essential";
import { Game } from "../../../shared/utils/game";
import SocketManager from "../SocketManager";
import LobbyStorage from "../LobbyStorage";

class GameManager {
  private static instance: GameManager | null = null;
  private games: Map<string, any> = new Map();
  private activeGames: Map<string, Game> = new Map();

  private constructor() {
    this.loadGames();
  }

  public handleGameAction(socket: CustomSocket, data: any): void {
    const lobby = LobbyStorage.getInstance().getLobbiesFromSocket(socket);

    if (lobby.length && this.activeGames.has(lobby[0].gameId)) {
      const game = this.activeGames.get(lobby[0].gameId);
      if (game) {
        game.receiveEvent(socket, data);
      }
    }
  }

  public static getInstance(io: Server): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  private loadGames(): void {
    const gamesPath = path.join(__dirname, "../games");

    const files = fs.readdirSync(gamesPath);
    console.log(files.map((file) => file.replace(".ts", "")));

    files.map((file) => {
      if (file.endsWith(".ts")) {
        const gamePath = path.join(gamesPath, file);
        const GameClass = require(gamePath).default;

        // Assume each game has a unique identifier, replace it accordingly
        this.games.set(file.replace(".ts", ""), GameClass);
      }
    });
  }

  public startGame(lobbyId: string, game: string, gameId: string): void {
    const GameClass = this.games.get(game);

    if (GameClass) {
      const io = SocketManager.getInstance().getIO();
      const gameInstance = new GameClass(io);
      this.activeGames.set(gameId, gameInstance);

      gameInstance.startGame(lobbyId, gameId);
    }
  }
}

export default GameManager;
