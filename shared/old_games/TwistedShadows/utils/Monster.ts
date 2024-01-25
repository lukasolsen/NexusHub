import { Board } from "../types/board";
import { Monster } from "../types/essential";
import { getPlayersCoordinates, moveTileTo } from "./board";

export class MonsterManagement {
  private static instance: MonsterManagement | null = null;
  private monsters: Monster[];

  constructor() {
    this.monsters = [
      {
        name: "The Thing",
        type: "THE_THING",

        maxAmount: 1,
        minAmount: 1,

        place: "Earth",
        mode: "passive", // The Thing is passive initially but has a unique spawning mechanic,
        entityType: "MONSTER",
      },
    ];
  }

  public static getInstance(): MonsterManagement {
    if (!MonsterManagement.instance) {
      MonsterManagement.instance = new MonsterManagement();
    }
    return MonsterManagement.instance;
  }

  public getMonsters = (): Monster[] => {
    return this.monsters;
  };

  public doAction = (board: Board): Board => {
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
      switch (monster.tile.split(" ")[1]) {
        case "The Thing": {
          //slowly follow after the player with a 90% chance
          this.theThingAI(board, monster);
          break;
        }
      }
    });

    board.tiles = tiles;

    return board;
  };

  private theThingAI = (
    board: Board,
    monster: {
      tile: string;
      index: number;
    }
  ): Board => {
    const randomChance = Math.random() * 100;

    if (randomChance < 90) {
      // Find the nearest player
      const playerCoordinates = getPlayersCoordinates(board);
      let nearestPlayerCoordinates: number[] = [];
      playerCoordinates.map((playerCoordinate) => {
        const playerX = playerCoordinate % board.width;
        const playerY = Math.floor(playerCoordinate / board.width);

        const monsterX = monster.index % board.width;
        const monsterY = Math.floor(monster.index / board.width);

        const distance = Math.sqrt(
          Math.pow(playerX - monsterX, 2) + Math.pow(playerY - monsterY, 2)
        );

        if (distance < 5) {
          nearestPlayerCoordinates = [playerX, playerY];
        }
      });

      // Move the monster towards the player
      if (nearestPlayerCoordinates.length > 0) {
        const [playerX, playerY] = nearestPlayerCoordinates;
        const [monsterX, monsterY] = [
          monster.index % board.width,
          Math.floor(monster.index / board.width),
        ];

        // Move the monster towards the player
        if (playerX > monsterX) {
          // Move right
          moveTileTo(board, monster.tile, monsterX + 1, monsterY);
        } else if (playerX < monsterX) {
          // Move left
          moveTileTo(board, monster.tile, monsterX - 1, monsterY);
        } else if (playerY > monsterY) {
          // Move down
          moveTileTo(board, monster.tile, monsterX, monsterY + 1);
        } else if (playerY < monsterY) {
          // Move up
          moveTileTo(board, monster.tile, monsterX, monsterY - 1);
        }
      }
    }

    board.tiles = board.tiles;

    return board;
  };
}
