export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Custom";
export type Place = "Earth";

export interface Item extends Entity {
  name: string;

  place: Place; // TODO: Change to enum

  rarity: Rarity;
}

export interface Trap extends Entity {
  name: string;

  place: Place; // TODO: Change to enum

  rarity: Rarity;
}

export interface Monster extends Entity {
  name: string;

  place: Place; // Where the monster spawns

  mode: "aggressive" | "scared" | "passive" | "hunting";
}

export interface Entity {
  type: string;
  minAmount: number;
  maxAmount: number;
  entityType: "TRAP" | "MONSTER" | "ITEM";
}
