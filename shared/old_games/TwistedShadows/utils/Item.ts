import { Board } from "../types/board";
import { Item } from "../types/essential";
import { Player } from "../types/player";
import { moveTileTo } from "./board";

export class ItemManagement {
  private static instance: ItemManagement | null = null;
  private items: Item[];

  constructor() {
    this.items = [
      {
        name: "Space Beacon",
        type: "SPACE_BEACON",
        maxAmount: 1,
        minAmount: 1,
        place: "Earth",
        rarity: "Custom",
        entityType: "ITEM",
      },
    ];
  }

  public static getInstance(): ItemManagement {
    if (!ItemManagement.instance) {
      ItemManagement.instance = new ItemManagement();
    }
    return ItemManagement.instance;
  }

  public getItems = (): Item[] => {
    return this.items;
  };

  public doAction = (
    board: Board,
    tile: number,
    player: Player
  ): { Player: Player; Board: Board } => {
    switch (board.tiles[tile]) {
      case "SPACE_BEACON": {
        console.log("Player " + player.name + " has found a space beacon!");
        return { Player: player, Board: board };
      }
      default: {
        break;
      }
    }

    return { Player: player, Board: board };
  };
}
