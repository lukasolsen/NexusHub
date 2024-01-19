import Tile from "./Tile";

class Entity {
  public tile: Tile;
  public sprite: string;
  public hp: number;

  constructor(tile: Tile, sprite: string, hp: number) {
    this.move(tile);
    this.sprite = sprite;
    this.hp = hp;
  }

  tryMove(dx, dy) {
    let newTile = this.tile.getNeighbor(dx, dy);
    if (newTile.passable) {
      if (!newTile.monster) {
        this.move(newTile);
      }
      return true;
    }
  }

  move(tile: Tile) {
    if (this.tile) {
      this.tile.monster = null;
    }
    this.tile = tile;
    tile.monster = this;
  }
}

export default Entity;
