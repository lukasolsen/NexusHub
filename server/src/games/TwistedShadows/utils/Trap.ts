import { Board } from "../types/board";
import { Player } from "../types/player";
import { getPlayersCoordinates, moveTileTo } from "./board";

interface Trap {
  name: string;
  type: string;
  minimalStage: number;
  maximalStage: number;
  place: string;
}

export class TrapManagement {
  private static instance: TrapManagement | null = null;
  private traps: Trap[];

  constructor() {
    this.traps = [
      {
        name: "Quicksand Quagmire",
        type: "Lethal Trap",
        minimalStage: 1,
        maximalStage: 5,

        place: "Alaska",
      },
    ];
  }

  public static getInstance(): TrapManagement {
    if (!TrapManagement.instance) {
      TrapManagement.instance = new TrapManagement();
    }
    return TrapManagement.instance;
  }

  public getTraps = (): Trap[] => {
    return this.traps;
  };

  public doAction = (
    board: Board,
    tile: number,
    player: Player
  ): { Player: Player; Board: Board } => {
    switch (board.tiles[tile]) {
      case "QUICKSAND_QUAGMIRE": {
        console.log("Player " + player.name + " has stepped on a trap!");
        break;
      }

      default: {
        break;
      }
    }

    return { Player: player, Board: board };
  };
}
