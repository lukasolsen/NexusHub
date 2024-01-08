import { Game } from "../../../../shared/utils/game";
import LobbyStorage from "../../LobbyStorage";
import { Socket } from "socket.io";
import SocketManager from "../../SocketManager";
import { CustomSocket } from "../../../../shared/types/essential";
import { Board } from "./types/board";
import { Monster } from "./types/monster";
import { TwistedShadowsType } from "./types/twistedType";
import { MonsterManagement } from "./utils/Monster";
import { findTile, generateBoard, getPlayerPosition } from "./utils/board";
import { forgePlayerStatus } from "./utils/player";
import { hasPlayerDied } from "./utils/movement";
import { TrapManagement } from "./utils/Trap";

class TwistedShadows extends Game {
  private game: TwistedShadowsType;
  private monsters: Monster[];
  private id: string;

  constructor() {
    super();

    this.monsters = MonsterManagement.getInstance().getMonsters();

    this.game = {
      id: "TwistedShadows",
      name: "Twisted Shadows",
      description: "A game of tic-tac-toe with a twist.",
      minPlayers: 1,
      maxPlayers: 1,
      lobbyId: null,
      ownerId: null,
      players: [],
      spectators: [],
      singleplayer: true,

      planets: [
        {
          board: null,
          monsters: this.monsters,
          name: "Earth",
        },
      ],
      currentPlanet: null,
    };
  }

  startGame(lobbyId: string, gameId: string): void {
    this.lobbyId = lobbyId;
    this.game.lobbyId = lobbyId;
    this.id = gameId;

    // Get the lobby from the lobbyId and transfer the players to the game
    const lobby = LobbyStorage.getInstance().getLobbyFromId(lobbyId);
    this.game.players = lobby.users.map((user) => {
      return {
        ...user,
        dead: false,
      };
    });

    this.game.ownerId = lobby.owner.id;

    // Start the enemy AI loop
    setInterval(() => {
      if (
        this.game.currentPlanet &&
        this.game.currentPlanet.board &&
        this.game.players.find((p) => !p.dead) &&
        this.game.players.length > 0
      ) {
        //const board = monstersAI(this.game.currentPlanet.board);
        const board = MonsterManagement.getInstance().doAction(
          this.game.currentPlanet.board
        );
        this.game.currentPlanet.board = board;

        this.updateGame();
      }

      if (this.game.players.length === 0) {
        this.game.currentPlanet = null;
        return this.updateGame();
      }
    }, 1000);
  }

  handleDisconnect(socket: CustomSocket): void {
    this.game.players = this.game.players.filter((p) => p.id !== socket.id);
  }

  private sendBoard(socket: Socket): void {
    if (this.game.currentPlanet) {
      const playerName = this.game.players.find(
        (p) => p?.id === socket?.id
      )?.name;

      const playerPosition = getPlayerPosition(
        this.game.currentPlanet.board,
        playerName
      );
      //const foggedBoard = this.createFoggedBoard(playerPosition);
      const foggedBoard = this.game.currentPlanet.board;

      // Replace all of the monster types to just MONSTER
      foggedBoard.tiles = foggedBoard.tiles.map((tile) =>
        tile.includes("MONSTER") ? "MONSTER" : tile
      );

      // Check if socket still exists
      if (!SocketManager.getInstance().getSocketFromId(socket?.id)) {
        return;
      }

      socket.emit("game", {
        type: "board",
        payload: foggedBoard,
      });
    }
  }

  private killPlayer(socket: Socket): void {
    this.game.players.find((p) => p.id === socket.id).dead = true;

    socket.emit("game", {
      type: "command",
      payload: `You died!`,
    });

    socket.emit("game", {
      type: "status",
      payload: forgePlayerStatus(
        this.game.players,
        this.game.currentPlanet.board,
        socket
      ),
    });
  }

  private createFoggedBoard(playerPosition: { x: number; y: number }): Board {
    const board = this.game.currentPlanet.board;
    const foggedBoard: Board = {
      ...board,
      tiles: [],
    };

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const distance = Math.sqrt(
          Math.pow(x - playerPosition.x, 2) + Math.pow(y - playerPosition.y, 2)
        );

        if (distance <= 1) {
          foggedBoard.tiles.push(board.tiles[y * board.width + x]);
        } else {
          foggedBoard.tiles.push("?");
        }
      }
    }

    return foggedBoard;
  }

  private movePlayer(socket: Socket, direction: string) {
    const player = this.game.players.find((p) => p.id === socket.id);

    const board = this.game.currentPlanet.board;
    const tiles = board.tiles;

    // Find player's coordinates
    const playerIndex = tiles.findIndex((t) =>
      t.includes("X (" + player.name + ")")
    );
    const playerX = playerIndex % board.width;
    const playerY = Math.floor(playerIndex / board.width);

    // Calculate new coordinates
    let newX = playerX;
    let newY = playerY;

    switch (direction) {
      case "forward":
        newY -= 1;
        break;
      case "backward":
        newY += 1;
        break;
      case "left":
        newX -= 1;
        break;
      case "right":
        newX += 1;
        break;
      default:
        break;
    }

    // Check if the new coordinates are valid
    if (newX < 0 || newX >= board.width || newY < 0 || newY >= board.height) {
      socket.emit("game", {
        type: "command",
        payload: `Invalid move: ${direction}`,
      });
      return;
    }

    // Find new player index
    const newPlayerIndex = newY * board.width + newX;

    // Check if the new tile is a wall
    if (tiles[newPlayerIndex] === "WALL") {
      socket.emit("game", {
        type: "command",
        payload: `Invalid move: ${direction}`,
      });
      return;
    }

    // Check if the player died
    const hasDied = hasPlayerDied(player, board, newPlayerIndex);
    if (hasDied) {
      this.killPlayer(socket);
      return;
    }

    TrapManagement.getInstance().doAction(board, newPlayerIndex, player);

    // Update player's position
    tiles[playerIndex] = "";
    tiles[newPlayerIndex] = "X (" + player.name + ")";

    this.game.currentPlanet.board = board;

    this.updateGame();

    socket.emit("game", {
      type: "command",
      payload: `Moved ${direction}!`,
    });
  }

  private updateGame(): void {
    // get each player
    this.game.players.map((player) => {
      // get the socket from the player
      const socket = SocketManager.getInstance().getSocketFromId(player.id);

      // send the board to the player
      this.sendBoard(socket);
    });
  }

  receiveEvent(socket: Socket, data: any): void {
    if (!this.game.players.find((p) => p.id === socket.id)) {
      socket.emit("game", {
        type: "command",
        payload: "You are not in this game.",
      });
      return;
    }

    switch (data.type) {
      case "command": {
        const { payload } = data;

        const command = payload.split(" ")[0];
        const args = payload.split(" ").slice(1);

        console.log(command, args);

        switch (command) {
          case "help":
            socket.emit("game", {
              type: "command",
              payload: "Commands: help",
            });
            break;

          case "planet": {
            if (this.game.currentPlanet) {
              socket.emit("game", {
                type: "command",
                payload: "You are already on a planet.",
              });
              return;
            }

            if (args.length < 1) {
              socket.emit("game", {
                type: "command",
                payload:
                  "Planets: \n" +
                  this.game.planets.map((p) => p.name).join("\n"),
              });
              return;
            }

            const planet = this.game.planets.find(
              (p) => p.name.toLowerCase() === args[0].toLowerCase()
            );

            // generate board
            planet.board = generateBoard(
              10,
              10,
              planet.monsters,
              this.game.players
            );

            if (!planet) {
              socket.emit("game", {
                type: "command",
                payload: `Planet ${args[0]} not found.`,
              });
              return;
            }

            socket.emit("game", {
              type: "command",
              payload: `Driving to planet ${planet.name}...`,
            });
            this.game.currentPlanet = planet;
            this.sendBoard(socket);
            break;
          }

          case "move": {
            // Example: move forward 3 (3 blocks)
            if (!this.game.currentPlanet) {
              socket.emit("game", {
                type: "command",
                payload: "You are not on a planet.",
              });
              return;
            }

            // Check if player is dead
            if (this.game.players.find((p) => p.dead)) {
              socket.emit("game", {
                type: "command",
                payload: "You are dead.",
              });
              return;
            }

            if (args.length < 1) {
              socket.emit("game", {
                type: "command",
                payload: "Usage: move <direction>",
              });
              return;
            }

            const direction = args[0].toLowerCase();

            const directions = ["forward", "backward", "left", "right"];

            if (!directions.includes(direction)) {
              socket.emit("game", {
                type: "command",
                payload: "Directions: forward, backward, left, right",
              });
              return;
            }

            this.movePlayer(socket, direction);
            break;
          }

          default:
            socket.emit("game", {
              type: "command",
              payload: `Unknown command: ${command}`,
            });
            break;
        }
        break;
      }
      default:
        break;
    }
  }
}

export default TwistedShadows;
