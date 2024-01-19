import { User } from "../../../../../shared/types/user";
import Tile from "../components/board/Tile";

function tryTo(description: string, callback: () => boolean | void) {
  for (let timeout = 1000; timeout > 0; timeout--) {
    if (callback()) {
      return;
    }
  }
  throw "Timeout while trying to " + description;
}

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr: any[]) {
  let temp: any[], r: number;
  for (let i = 1; i < arr.length; i++) {
    r = randomRange(0, i);
    temp = arr[i];
    arr[i] = arr[r];
    arr[r] = temp;
  }
  return arr;
}

const PlayerToTile = (player: User): Tile => {
  return new Tile(0, 0, 0, true, "Player (" + player.id + ")");
};

export { tryTo, randomRange, shuffle, PlayerToTile };
