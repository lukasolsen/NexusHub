import { User } from "../../../../../shared/types/user";
import { PlayerToTile, randomRange } from "../util/utils";
import Floor from "./board/Floor";
import Tile from "./board/Tile";
import Wall from "./board/Wall";

class BoardGeneration {
  private static instance: BoardGeneration;
  static getInstance() {
    if (!BoardGeneration.instance) {
      BoardGeneration.instance = new BoardGeneration();
    }

    return BoardGeneration.instance;
  }
  private tiles: any;
  private numTiles: number;
  private passableTiles: any[] = [];
  private entities: any[] = [];

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

  generateBoardForLobby() {
    return this.tiles.map((row: any) => {
      return row.map((tile: Tile) => {
        return tile.draw().name;
      });
    });
  }

  generateLevel() {
    return this.tiles;
  }

  populateBoard() {
    this.addPlayers(this.entities);
  }

  generateTiles() {
    let tiles = [];

    for (let i = 0; i < this.numTiles; i++) {
      tiles[i] = [];
      for (let j = 0; j < this.numTiles; j++) {
        if (Math.random() < 0.3 || !this.inBounds(i, j)) {
          tiles[i][j] = new Wall(i, j);
        } else {
          tiles[i][j] = new Floor(i, j);
          this.passableTiles.push(tiles[i][j]);
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
    return this.passableTiles[randomRange(0, this.passableTiles.length - 1)];
  }

  private addPlayers(players: User[]) {
    players.forEach((player) => {
      let tile = this.randomPassableTile();
      tile.entity = PlayerToTile(player);
      this.entities.push(tile.entity);

      this.tiles[tile.x][tile.y] = tile;
    });
  }
}

export default BoardGeneration;
