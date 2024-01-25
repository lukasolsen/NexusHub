import { Board } from "../types/board";
import { Trap } from "../types/essential";
import { Player } from "../types/player";

export class TrapManagement {
  static TrapManagement() {
    throw new Error("Method not implemented.");
  }
  private static instance: TrapManagement | null = null;
  private traps: Trap[];

  constructor() {
    this.traps = [
      {
        name: "Quicksand Quagmire",
        minAmount: 1,
        maxAmount: 3,
        place: "Earth",
        rarity: "Common",
        type: "QUICKSAND_QUAGMIRE",
        entityType: "TRAP",
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
