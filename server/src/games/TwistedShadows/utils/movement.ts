import { Board } from "../types/board";
import { Player } from "../types/player";

export const hasPlayerDied = (
  player: Player,
  board: Board,
  newPlayerIndex: number
): boolean => {
  const tiles = board.tiles;

  // Check if the player's tile has a monster
  if (tiles[newPlayerIndex].includes("MONSTER")) {
    console.log("Player died to a monster.");
    return true;
  }

  return false;
};
