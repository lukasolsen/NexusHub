import { CustomSocket } from "../../../shared/types/essential";
import { Game as GameUtil } from "../../../shared/utils/game";
import Game from "../../../shared/models/Game";
import SocketManager from "../SocketManager";
import LobbyStorage from "../LobbyStorage";
import { listGames } from "../../../shared/utils/game-loader";
import * as path from "path";

class GameManager {
  private static instance: GameManager | null = null;
  private activeGames: Map<string, GameUtil> = new Map();
  private games: Map<string, any> = new Map();

  private constructor() {
    this.activeGames = new Map();

    this.loadGames();
  }

  private async loadGames(): Promise<void> {
    const games = await this.getGames();

    games.forEach((game) => {
      const gamePath = path.join(
        __dirname,
        "../../../shared/games",
        game.owner_id.toString(),
        game.id.toString(),
        game.main
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const gameClass = require(gamePath).default;
      this.games.set(game.name, gameClass);
    });
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

  public getGames(): any[] {
    const games = listGames();

    return games;
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
