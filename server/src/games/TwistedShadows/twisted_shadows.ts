import { Game } from "../../../../shared/utils/game";
import LobbyStorage from "../../LobbyStorage";
import { Socket } from "socket.io";
import SocketManager from "../../SocketManager";
import { CustomSocket } from "../../../../shared/types/essential";
import { Monster } from "./types/essential";
import { TwistedShadowsType } from "./types/twistedType";
import { MonsterManagement } from "./utils/Monster";
import { generateBoard, getPlayerPosition } from "./utils/board";
import { forgePlayerStatus } from "./utils/player";
import { movePlayer } from "./utils/movement";
import { TrapManagement } from "./utils/Trap";
import { ItemManagement } from "./utils/Item";

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
              [
                ...MonsterManagement.getInstance().getMonsters(),
                ...TrapManagement.getInstance().getTraps(),
                ...ItemManagement.getInstance().getItems(),
              ],
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
              break;
            }

            movePlayer(
              this.game.currentPlanet.board,
              socket,
              this.game.players,
              this.killPlayer,
              direction
            );
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
