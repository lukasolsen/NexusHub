import { shuffle } from "../../util/utils";
import BoardGeneration from "../board";
import Entity from "../entities/Entity";

class Tile {
  public x: number;
  public y: number;
  public sprite: number;
  public passable: boolean;
  public name: string;
  public entity: Entity | null = null;

  constructor(
    x: number,
    y: number,
    sprite: number,
    passable: boolean,
    name: string
  ) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.passable = passable;
    this.name = name;
  }

  draw() {
    return {
      x: this.x,
      y: this.y,
      sprite: this.sprite,
      passable: this.passable,
      name: this.name,
    };
  }

  getNeighbor(dx: number, dy: number) {
    return BoardGeneration.getInstance().getTile(this.x + dx, this.y + dy);
  }

  getAdjacentNeighbors() {
    return shuffle([
      this.getNeighbor(0, -1),
      this.getNeighbor(0, 1),
      this.getNeighbor(-1, 0),
      this.getNeighbor(1, 0),
    ]);
  }

  getAdjacentPassableNeighbors() {
    return this.getAdjacentNeighbors().filter((t) => t.passable);
  }

  getConnectedTiles() {
    let connectedTiles = [this];
    let frontier = [this];
    while (frontier.length) {
      let neighbors = frontier
        .pop()
        .getAdjacentPassableNeighbors()
        .filter((t) => !connectedTiles.includes(t));
      connectedTiles = connectedTiles.concat(neighbors);
      frontier = frontier.concat(neighbors);
    }
    return connectedTiles;
  }
}

export default Tile;
