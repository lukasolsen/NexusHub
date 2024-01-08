export interface Monster {
  type: string;
  minimalStage: number;
  maximalStage: number;
  place: string; // Where the monster spawns

  mode: "aggressive" | "scared" | "passive" | "hunting";
}
