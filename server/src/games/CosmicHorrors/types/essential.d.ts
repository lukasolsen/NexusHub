type ItemType = "Sword" | "Shield" | "Potion"; // Add more item types as needed
type MonsterType = "Goblin" | "Dragon" | "Skeleton"; // Add more monster types as needed
type PlayerType = "Warrior" | "Mage" | "Rogue"; // Add more player types as needed

export interface Item {
  type: ItemType;
  x: number;
  y: number;
}

export interface Monster {
  type: MonsterType;
  x: number;
  y: number;
}

export interface Player {
  type: PlayerType;
  x: number;
  y: number;
}
