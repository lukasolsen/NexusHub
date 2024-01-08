import { Board } from "./board";
import { Monster } from "./monster";

export interface Planet {
  name: string;

  monsters: Monster[];
  board: Board;
}