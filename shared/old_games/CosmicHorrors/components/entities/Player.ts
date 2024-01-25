import Entity from "./Entity";

class Player extends Entity {
  constructor(tile) {
    super(tile, 0, 3);
    this.isPlayer = true;
  }

  draw() {
    return {
      name: "Player",
      sprite: this.sprite,
      x: this.tile.x,
      y: this.tile.y,
    };
  }
}

export default Player;
