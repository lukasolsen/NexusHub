import { Board } from "./board";
import { Monster } from "./essential";

export interface Planet {
  name: string;

  monsters: Monster[];
  board: Board;
}