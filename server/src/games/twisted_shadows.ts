// games/TwistedShadows.ts
import { Game } from "../../../shared/utils/game";
import { GameType } from "../../../shared/types/game";
import LobbyStorage from "../LobbyStorage";
import { User } from "../../../shared/types/user";
import { Socket } from "socket.io";
import SocketManager from "../SocketManager";
import { CustomSocket } from "../../../shared/types/essential";

interface Board {
  tiles: string[]; // Array of tiles
  width: number;
  height: number;
}

interface Monster {
  type: string;
  minimalStage: number;
  maximalStage: number;
  place: string; // Where the monster spawns

  mode: "aggressive" | "scared" | "passive" | "hunting";
}

interface Player extends User {
  dead: boolean;
}

interface Planet {
  name: string;

  monsters: Monster[];
  board: Board;
}

const generateBoard = (
  width: number,
  height: number,
  monsters: Monster[]
): Board => {
  const tiles = Array(width * height).fill("");

  // Randomly assign tile values
  let playerPlaced = false;
  for (let i = 0; i < tiles.length; i++) {
    // Create border
    if (
      i < width ||
      i >= width * (height - 1) ||
      i % width === 0 ||
      i % width === width - 1
    ) {
      tiles[i] = "WALL";
    } else if (!playerPlaced) {
      // Place player
      tiles[i] = "X";
      playerPlaced = true;
    } else {
      // Place monster with a small probability
      // Random this.monster
      const monster = monsters[Math.floor(Math.random() * monsters.length)];

      const randomValue = Math.random() < 0.1 ? "MONSTER " + monster.type : "";
      tiles[i] = randomValue;
    }
  }

  console.log(tiles);

  return { tiles, width, height };
};

const monstersAI = (board: Board): Board => {
  /**
   * A AI that moves the monsters on the board.
   * Each second, the AI will randomize a chance to move each monster. If the monster moves, it will move into a special direction.
   * @param board The board to move the monsters on.
   */
  const tiles = board.tiles;

  // Find monsters
  const monsters = tiles
    .map((tile, index) => ({ tile, index }))
    .filter((tile) => tile.tile.includes("MONSTER"));

  monsters.map((monster, index: number) => {
    // Random chance to move between 0 and 100, 5 percent to move
    const chance = Math.floor(Math.random() * 100);
    if (chance <= 5) {
      console.log("Moving monster");
      // move monster
      // Find monster's coordinates
      const monsterX = monster.index % board.width;
      const monsterY = Math.floor(monster.index / board.width);

      // Find monster's new coordinates
      let newX = monsterX;
      let newY = monsterY;

      // Randomize direction
      const direction = Math.floor(Math.random() * 4);

      switch (direction) {
        case 0:
          newY -= 1;
          break;
        case 1:
          newY += 1;
          break;
        case 2:
          newX -= 1;
          break;
        case 3:
          newX += 1;
          break;
        default:
          break;
      }

      // Check if the new coordinates are valid
      if (newX < 0 || newX >= board.width) {
        return;
      }

      if (newY < 0 || newY >= board.height) {
        return;
      }

      // Find new monster index
      const newMonsterIndex = newY * board.width + newX;

      // Check if the new tile is a wall
      if (tiles[newMonsterIndex] === "WALL") {
        return;
      }

      // Check if the new tile is a player, 25% chance to move to player.
      if (tiles[newMonsterIndex] === "X") {
        const chance = Math.floor(Math.random() * 100);
        if (chance <= 25) {
          tiles[monster.index] = "";
          tiles[newMonsterIndex] = "MONSTER";

          // Kill player
          return;
        }
        return;
      }

      // Move monster
      tiles[monster.index] = "";
      tiles[newMonsterIndex] = "MONSTER";
    }
  });

  board.tiles = tiles;

  return board;
};

interface TwistedShadowsType extends GameType {
  planets: Planet[];
  currentPlanet?: Planet;
  players: Player[];
}

const findTiles = (board: Board, tileWord: string): number[] => {
  const tiles = board.tiles;

  return tiles.map((tile, index) => (tile === tileWord ? index : -1));
};

const findTile = (board: Board, tileWord: string): number => {
  const tiles = board.tiles;

  return tiles.findIndex((tile) => tile === tileWord);
};

class TwistedShadows extends Game {
  private game: TwistedShadowsType;
  private monsters: Monster[];
  private id: string;

  constructor() {
    super();

    this.monsters = [
      {
        type: "The Thing",
        minimalStage: 1,
        maximalStage: 5,
        place: "Alaska",
        mode: "passive", // The Thing is passive initially but has a unique spawning mechanic
      },
    ];

    this.game = {
      id: "twisted_shadows",
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
          board: generateBoard(10, 10, this.monsters),
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
        const board = monstersAI(this.game.currentPlanet.board);
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
    // Remove the player from the game
    this.game.players = this.game.players.filter((p) => p.id !== socket.id);

    // stop the game if there are no players left
  }

  private forgePlayerStatus(socket: Socket) {
    const player = this.game.players.find((p) => p.id === socket.id);
    if (!player) {
      return;
    }

    const playerPosition = this.getPlayerPosition();
    const playerX = playerPosition?.x;
    const playerY = playerPosition?.y;

    const playerStatus = {
      name: player.name,
      dead: player.dead,
      x: playerX,
      y: playerY,
    };

    return playerStatus;
  }

  private sendBoard(socket: Socket): void {
    if (this.game.currentPlanet) {
      const playerPosition = this.getPlayerPosition();
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
      payload: this.forgePlayerStatus(socket),
    });
  }

  private getPlayerPosition(): { x: number; y: number } | null {
    const board = this.game.currentPlanet.board;
    const playerIndex = findTile(board, "X");

    if (playerIndex === -1) {
      return null;
    }

    const playerX = playerIndex % board.width;
    const playerY = Math.floor(playerIndex / board.width);

    return { x: playerX, y: playerY };
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

  private movePlayer(socket: Socket, direction: string, distance: number) {
    // Use the current planet's board. If the tile the player is moving to is a WALL, don't allow it, otherwise move the player to that tile. If the tile is a monster then make a console message.
    const board = this.game.currentPlanet.board;
    const tiles = board.tiles;

    // Find player
    const playerIndex = tiles.findIndex((t) => t === "X");

    // Find player's coordinates
    const playerX = playerIndex % board.width;
    const playerY = Math.floor(playerIndex / board.width);

    // Find player's new coordinates
    let newX = playerX;
    let newY = playerY;

    switch (direction) {
      case "forward":
        newY -= distance;
        break;
      case "backward":
        newY += distance;
        break;
      case "left":
        newX -= distance;
        break;
      case "right":
        newX += distance;
        break;
      default:
        break;
    }

    // Check if the new coordinates are valid
    if (newX < 0 || newX >= board.width) {
      console.log(newX);
      socket.emit("game", {
        type: "command",
        payload: `Invalid move: ${direction} ${distance}`,
      });
      return;
    }

    if (newY < 0 || newY >= board.height) {
      console.log(newY);
      socket.emit("game", {
        type: "command",
        payload: `Invalid move: ${direction} ${distance}`,
      });
      return;
    }

    // Find new player index
    const newPlayerIndex = newY * board.width + newX;

    // Check if the new tile is a wall
    if (tiles[newPlayerIndex] === "WALL") {
      console.log(newPlayerIndex);
      socket.emit("game", {
        type: "command",
        payload: `Invalid move: ${direction} ${distance}`,
      });
      return;
    }

    const passedMonster = tiles.findIndex(
      (t, i) => i > playerIndex && i < newPlayerIndex && t.includes("MONSTER")
    );

    if (passedMonster !== -1) {
      this.killPlayer(socket);
      return;
    }

    if (tiles[newPlayerIndex].includes("MONSTER")) {
      this.killPlayer(socket);
      return;
    }

    tiles[playerIndex] = "";
    tiles[newPlayerIndex] = "X";

    this.game.currentPlanet.board = board;

    this.updateGame();

    socket.emit("game", {
      type: "command",
      payload: `Moved ${direction} ${distance}!`,
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

            if (args.length < 2) {
              socket.emit("game", {
                type: "command",
                payload: "Usage: move <direction> <distance>",
              });
              return;
            }

            const direction = args[0].toLowerCase();
            const distance = parseInt(args[1]);

            const directions = ["forward", "backward", "left", "right"];

            if (!directions.includes(direction)) {
              socket.emit("game", {
                type: "command",
                payload: "Directions: forward, backward, left, right",
              });
              return;
            }

            if (isNaN(distance)) {
              socket.emit("game", {
                type: "command",
                payload: `Invalid distance: ${distance}`,
              });
              return;
            }

            this.movePlayer(socket, direction, distance);
            break;
          }

          default:
            socket.emit("game", {
              type: "command",
              payload: `Unknown command: ${command}`,
            });
            break;
        }
      }
      default:
        break;
    }
  }
}

export default TwistedShadows;
