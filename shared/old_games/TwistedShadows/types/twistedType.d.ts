import { GameType } from "../../../../../shared/types/game";
import { Planet } from "./planet";
import { Player } from "./player";

export interface TwistedShadowsType extends GameType {
  planets: Planet[];
  currentPlanet?: Planet;
  players: Player[];
}
