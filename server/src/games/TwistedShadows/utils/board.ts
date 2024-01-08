import { Monster } from "../types/monster";
import { Board } from "../types/board";
import { Player } from "../types/player";

interface SafeZone {
  row: number;
  col: number;
}

export const generateBoard = (
  width: number,
  height: number,
  monsters: Monster[],
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

  // Randomly place players in safe zones
  const playerPositions: SafeZone[] = [];
  for (let i = 0; i < players.length; i++) {
    let safeZone: SafeZone;
    do {
      safeZone = {
        row: Math.floor(Math.random() * (height - 2)) + 1,
        col: Math.floor(Math.random() * (width - 2)) + 1,
      };
    } while (
      playerPositions.some(
        (position) =>
          position.row === safeZone.row && position.col === safeZone.col
      ) ||
      safeZones.some(
        (position) =>
          position.row === safeZone.row && position.col === safeZone.col
      )
    );
    playerPositions.push(safeZone);

    // Place player
    tiles[safeZone.row * width + safeZone.col] = "X (" + players[i].name + ")";
  }

  // Randomly place monsters and traps
  let monsterCount = 0;
  let trapCount = 0;
  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      if (
        playerPositions.some(
          (position) => position.row === i && position.col === j
        )
      ) {
        // Skip player positions
        continue;
      }

      const randomValue = Math.random();
      if (randomValue < 0.02 && monsterCount < 5) {
        const monster = monsters[Math.floor(Math.random() * monsters.length)];
        tiles[i * width + j] = "MONSTER " + monster.type;
        monsterCount++;
      } else if (randomValue < 0.04 && trapCount < 3) {
        tiles[i * width + j] = "QUICKSAND_QUAGMIRE";
        trapCount++;
      } else {
        tiles[i * width + j] = "";
      }
    }
  }

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
