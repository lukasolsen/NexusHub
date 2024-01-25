import { CustomSocket } from "../../../shared/types/essential";
import { Game } from "../../../shared/utils/game";
import SocketManager from "../SocketManager";
import LobbyStorage from "../LobbyStorage";
import { listManifests } from "../../../shared/utils/game-loader";
import * as path from "path";

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
    console.log("path", __dirname);

    listManifests().map((manifest) => {
      if (manifest) {
        const gamesPath = path.join(__dirname, "../../../shared/games");
        console.log(gamesPath);

        const game =
          require(`${gamesPath}/${manifest.file}/${manifest.main}`).default;
        this.games.set(manifest.name, game);
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
