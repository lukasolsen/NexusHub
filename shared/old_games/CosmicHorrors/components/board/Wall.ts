import Tile from "./Tile";

class Wall extends Tile {
  constructor(x: number, y: number) {
    super(x, y, 3, false, "Wall");
  }
}

export default Wall;
