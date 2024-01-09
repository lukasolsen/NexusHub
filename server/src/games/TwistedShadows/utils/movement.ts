import { Socket } from "socket.io";
import { Board } from "../types/board";
import { Player } from "../types/player";
import { findPlayer } from "./player";
import { TrapManagement } from "./Trap";

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

export const movePlayer = (
  board: Board,
  socket: Socket,
  players: Player[],
  killPlayer: (socket: Socket) => void,
  direction: string
) => {
  const player = findPlayer(players, socket);

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
    console.log(
      "Invalid move: coordinates",
      newX < 0,
      newX >= board.width,
      newY < 0,
      newY >= board.height,
      newX,
      newY
    );
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
    console.log("Invalid move: wall");
    socket.emit("game", {
      type: "command",
      payload: `Invalid move: ${direction}`,
    });
    return;
  }

  // Check if the new tile is a player
  if (tiles[newPlayerIndex].includes("X (")) {
    console.log("Invalid move: player");
    socket.emit("game", {
      type: "command",
      payload: `Invalid move: ${direction}`,
    });
    return;
  }

  // Check if the player died
  const hasDied = hasPlayerDied(player, board, newPlayerIndex);
  if (hasDied) {
    killPlayer(socket);
    return;
  }

  TrapManagement.getInstance().doAction(board, newPlayerIndex, player);

  // Update player's position
  tiles[playerIndex] = "";
  tiles[newPlayerIndex] = "X (" + player.name + ")";

  return { board: board };
};
