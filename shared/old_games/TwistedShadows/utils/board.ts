import { Board } from "../types/board";
import { Entity } from "../types/essential";
import { Player } from "../types/player";
interface SafeZone {
  row: number;
  col: number;
}

const getRandomSafeZone = (
  takenPositions: SafeZone[],
  height: number,
  width: number
): SafeZone => {
  let safeZone: SafeZone;
  do {
    safeZone = {
      row: Math.floor(Math.random() * (height - 2)) + 1,
      col: Math.floor(Math.random() * (width - 2)) + 1,
    };
  } while (
    takenPositions.some(
      (position) =>
        position.row === safeZone.row && position.col === safeZone.col
    )
  );
  return safeZone;
};

const addEntity = (
  tiles: string[],
  width: number,
  height: number,
  type: string,
  minAmount: number,
  maxAmount: number,
  entityType: "TRAP" | "MONSTER" | "ITEM"
): void => {
  console.log(entityType, type);
  let count = 0;
  let attempts = 0;

  while (count < minAmount && attempts < 1000) {
    for (let i = 1; i < height - 1 && count < maxAmount; i++) {
      for (let j = 1; j < width - 1 && count < maxAmount; j++) {
        if (Math.random() < maxAmount / (width * height)) {
          // check if it's a trap or a monster.
          tiles[i * width + j] = `${entityType} (${type.toUpperCase()})`;
          count++;
        }
      }
    }

    attempts++;
  }
};

const addPlayer = (
  playerName: string,
  tiles: string[],
  width: number,
  height: number,
  safeZones: SafeZone[]
) => {
  const safeZone = getRandomSafeZone(safeZones, height, width);
  if (tiles[safeZone.row * width + safeZone.col] !== "") {
    tiles[safeZone.row * width + safeZone.col] = "X (" + playerName + ")";
    safeZones.push(safeZone);
  } else {
    addPlayer(playerName, tiles, width, height, safeZones);
  }
};

export const generateBoard = (
  width: number,
  height: number,
  entities: Entity[],
  players: Player[]
): Board => {
  const tiles = Array(width * height).fill("");
  const safeZones: SafeZone[] = [];

  // Create border
  for (let i = 0; i < width; i++) {
    tiles[i] = "WALL";
    tiles[width * (height - 1) + i] = "WALL";
  }
  for (let i = 1; i < height - 1; i++) {
    tiles[i * width] = "WALL";
    tiles[i * width + width - 1] = "WALL";
  }

  const entityCount: { [key: string]: { count: number } } = {
    ...entities.reduce((acc, entity) => {
      acc[entity.type] = { count: 0 };
      return acc;
    }, {}),
  };

  // Randomly place entities
  // Loop around the board and place entities
  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      // Check if the tile is empty
      if (tiles[i * width + j] === "") {
        // Make a random chance for an entity to be placed
        const randomChance = Math.random();

        // Iterate through entities to find a suitable one
        for (const entity of entities) {
          // check if we're already made the max amount of this entity
          if (entityCount[entity.type].count >= entity.maxAmount) {
            continue;
          }

          // make a random 30 to 100% chance for this entity to be placed
          if (randomChance < entity.maxAmount / (width * height)) {
            // place the entity
            tiles[i * width + j] = entity.type;
            entityCount[entity.type].count++;
          }
        }
      }
    }
  }

  // A final check to see if all entity conditions are met
  entities.map((entity) => {
    if (entityCount[entity.type].count < entity.minAmount) {
      // If this condition is met, we need to add more entities
      // Loop around the board yet again, but now we need to force add some of them, this time just a few blocks away from the player

      for (let i = 1; i < height - 1; i++) {
        for (let j = 1; j < width - 1; j++) {}
      }
    }
  });

  // Randomly place players
  players.forEach((player) => {
    addPlayer(player.id, tiles, width, height, safeZones);
  });

  console.log(tiles);

  return { tiles, width, height };
};

export const getPlayersCoordinates = (board: Board): number[] => {
  const tiles = board.tiles;

  return tiles
    .map((tile, index) => ({ tile, index }))
    .filter((tile) => tile.tile === "X")
    .map((tile) => tile.index);
};

export const getTileCoordinates = (
  tiles: string[],
  tileName: string
): number[] => {
  return tiles
    .map((tile, index) => ({ tile, index }))
    .filter((tile) => tile.tile === tileName)
    .map((tile) => tile.index);
};

export const moveTileTo = (
  board: Board,
  tile: string,
  x: number,
  y: number
): Board => {
  const tiles = board.tiles;

  const [tileX, tileY] = getTileCoordinates(tiles, tile);

  // Move tile to new coordinates
  const newTileIndex = y * board.width + x;
  tiles[newTileIndex] = tile;
  tiles[tileY * board.width + tileX] = "";

  board.tiles = tiles;

  return board;
};

export const findTiles = (tiles: string[], tileWord: string): number[] => {
  return tiles.map((tile, index) => (tile === tileWord ? index : -1));
};

export const findTile = (tiles: string[], tileWord: string): number => {
  return tiles.findIndex((tile) => tile === tileWord);
};

export const getPlayerPosition = (
  board: Board,
  playerName: string
): { x: number; y: number } | null => {
  const playerIndex = findTile(board.tiles, "X (" + playerName + ")");

  if (playerIndex === -1) {
    return null;
  }

  const playerX = playerIndex % board.width;
  const playerY = Math.floor(playerIndex / board.width);

  return { x: playerX, y: playerY };
};

export const createFoggedBoard = (
  board: Board,
  playerPosition: {
    x: number;
    y: number;
  }
): Board => {
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
};
