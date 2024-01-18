import { randomRange, tryTo } from "../util/utils";
import Floor from "./board/Floor";
import Tile from "./board/Tile";
import Wall from "./board/Wall";

class BoardGeneration {
  private tiles: any;
  private numTiles: number;
  private startingTile: any;
  private x: number;
  private y: number;

  constructor() {
    this.numTiles = 10;
    this.tiles = this.generateTiles();
    //this.startingTile = this.randomPassableTile();
    //this.x = this.startingTile.x;
    //this.y = this.startingTile.y;

    console.log("tiles", this.tiles);
  }

  generateLevel() {
    return this.tiles;
  }

  generateTiles() {
    let tiles = [];

    for (let i = 0; i < this.numTiles; i++) {
      tiles[i] = [];
      for (let j = 0; j < this.numTiles; j++) {
        if (Math.random() < 0.3 || !this.inBounds(i, j)) {
          tiles[i][j] = new Wall(i, j).draw().name;
        } else {
          tiles[i][j] = new Floor(i, j).draw().name;
        }
      }
    }

    return tiles;
  }

  getTile(x: number, y: number): Tile {
    if (this.inBounds(x, y)) {
      return this.tiles[x][y];
    } else {
      return new Wall(x, y);
    }
  }

  getTiles() {
    return this.tiles;
  }

  private inBounds(x: number, y: number) {
    return x > 0 && y > 0 && x < this.numTiles - 1 && y < this.numTiles - 1;
  }

  private randomPassableTile() {
    let tile: Tile;

    let x = randomRange(0, this.numTiles - 1);
    let y = randomRange(0, this.numTiles - 1);
    tile = this.getTile(x, y);

    if (tile.passable) {
      return tile;
    }
  }
}

export default BoardGeneration;
