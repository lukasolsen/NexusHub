import { GameType } from "../../../../../shared/types/game";
import { Player } from "./player";


export interface MazeRunnerType extends GameType {
  players: Player[];
}
