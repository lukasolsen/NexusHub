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

    this.activeGames = new Map();
  }

  public handleGameAction(socket: CustomSocket, data: any): void {
    const lobby = LobbyStorage.getInstance().getLobbiesFromSocket(socket);

    if (lobby && this.activeGames.has(lobby.gameId)) {
      const game = this.activeGames.get(lobby.gameId);
      if (game) {
        game.receiveEvent(socket, data);
      }
    }
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  private loadGames(): void {
    const gamesPath = path.join(__dirname, "../games");

    const folders = fs.readdirSync(gamesPath);

    folders.map((file) => {
      // Only find folders, go into the folder and read the manifest.json and look for "main" field and load that file
      if (fs.lstatSync(path.join(gamesPath, file)).isDirectory()) {
        const manifestPath = path.join(gamesPath, file, "manifest.json");
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        const GameClass = require(path.join(
          gamesPath,
          file,
          manifest.main
        )).default;

        // Assume each game has a unique identifier, replace it accordingly
        this.games.set(manifest.name, GameClass);
      }
    });
  }

  public getGames(): string[] {
    return Array.from(this.games.keys());
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

  public handleDisconnect(socket: CustomSocket): void {
    const lobby = LobbyStorage.getInstance().getLobbiesFromSocket(socket);

    if (lobby && this.activeGames.has(lobby.gameId)) {
      const game = this.activeGames.get(lobby.gameId);
      if (game) {
        game.handleDisconnect(socket);
        // If the game has no more players, remove it
        if (game.getUsers().length === 0) {
          this.activeGames.delete(lobby.gameId);
        }
      }
    }
  }
}

export default GameManager;
