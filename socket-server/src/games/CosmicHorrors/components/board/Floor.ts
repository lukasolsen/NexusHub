import Tile from "./Tile";

class Floor extends Tile {
  constructor(x: number, y: number) {
    super(x, y, 2, true, "Floor");
  }
}

export default Floor;
