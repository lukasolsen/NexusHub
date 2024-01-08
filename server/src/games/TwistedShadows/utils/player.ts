import { Socket } from "socket.io";
import { Player } from "../types/player";
import { getPlayerPosition } from "./board";
import { Board } from "../types/board";

export const forgePlayerStatus = (
  players: Player[],
  board: Board,
  socket: Socket
) => {
  const player = players.find((p) => p.id === socket.id);
  if (!player) {
    return;
  }

  const playerPosition = getPlayerPosition(board, player.name);
  const playerX = playerPosition?.x;
  const playerY = playerPosition?.y;

  const playerStatus = {
    name: player.name,
    dead: player.dead,
    x: playerX,
    y: playerY,
  };

  return playerStatus;
};
