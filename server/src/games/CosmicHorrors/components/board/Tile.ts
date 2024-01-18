class Tile {
  public x: number;
  public y: number;
  public sprite: number;
  public passable: boolean;
  public name: string;

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
}

export default Tile;
