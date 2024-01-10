import { Socket } from "socket.io";
import { Player } from "../../TwistedShadows/types/player";

export const inGame = (socket: Socket, players: Player[]): boolean => {
  if (players.find((p) => p.id === socket.id)) {
    return true;
  }
  return false;
};
