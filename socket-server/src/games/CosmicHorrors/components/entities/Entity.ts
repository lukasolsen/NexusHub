import Tile from "../board/Tile";

class Entity {
  public tile: Tile;
  public sprite: number;
  public hp: number;

  public isPlayer: boolean = false;

  constructor(tile: Tile, sprite: number, hp: number) {
    this.move(tile);
    this.sprite = sprite;
    this.hp = hp;
  }

  tryMove(dx, dy) {
    let newTile = this.tile.getNeighbor(dx, dy);
    if (newTile.passable) {
      if (!newTile.entity) {
        this.move(newTile);
      }
      return true;
    }
  }

  move(tile: Tile) {
    if (this.tile) {
      this.tile.entity = null;
    }
    this.tile = tile;
    tile.entity = this;
  }
}

export default Entity;
