interface AllowedInput {
  name: string;
  type: string;

  maxItem: number;
  minItem: number;
}

class BoardMapGenerator {
  private width: number;
  private height: number;
  private boardMap: string[];

  constructor() {
    this.width = 10;
    this.height = 10;
    this.boardMap = [];
  }

  /**
   * Generate a board map with the given width and height
   */
  generate() {
    let map: string[] = [];
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        map.push(" ");
      }
    }

    this.boardMap = map;
  }

  addToBoard(Input: AllowedInput) {
    // Input is: {
    //  name: "sword",
    //  type: "weapon",
    //  maxItem: 3,
    //  minItem: 1,
    //}

    // Add the items to the board. Make sure to not overwrite any existing items also follow the rarity rules
    let itemNumber =
      Math.floor(Math.random() * (Input.maxItem - Input.minItem + 1)) +
      Input.minItem;
    for (let j = 0; j < itemNumber; j++) {
      let randomIndex = Math.floor(Math.random() * this.boardMap.length);
      if (this.boardMap[randomIndex] === " ") {
        this.boardMap[randomIndex] = Input.name;
      }
    }
  }

  findSafeSpots() {
    // Find a safe spot for the player to spawn, he should not be near a item. At least 2 tiles away.

    let safeSpot = false;
    let safeSpotIndex = 0;

    while (!safeSpot) {
      safeSpotIndex = Math.floor(Math.random() * this.boardMap.length);
      if (this.boardMap[safeSpotIndex] === " ") {
        safeSpot = true;
        this.boardMap[safeSpotIndex] = "P";
      }
    }
  }

  display() {
    console.log(this.boardMap);
  }

  createPath() {
    // Create allowed path for the player to move.

    // For now just ignore player and items.

    for (let i = 0; i < this.boardMap.length; i++) {
      let tile = this.boardMap[i];
      if (tile === " ") {
        let tileX = i % this.width;
        let tileY = Math.floor(i / this.width);

        let tileUp = this.getTile(tileX, tileY - 1);
        let tileDown = this.getTile(tileX, tileY + 1);
        let tileLeft = this.getTile(tileX - 1, tileY);
        let tileRight = this.getTile(tileX + 1, tileY);

        if (tileUp === "P") {
          this.boardMap[i] = "U";
        } else if (tileDown === "P") {
          this.boardMap[i] = "D";
        } else if (tileLeft === "P") {
          this.boardMap[i] = "L";
        } else if (tileRight === "P") {
          this.boardMap[i] = "R";
        }
      }
    }
  }

  calculateDistance(itemIndex: number, playerIndex: number) {
    const itemX = itemIndex % this.width;
    const itemY = Math.floor(itemIndex / this.width);

    const playerX = playerIndex % this.width;
    const playerY = Math.floor(playerIndex / this.width);

    const distance = Math.sqrt(
      Math.pow(itemX - playerX, 2) + Math.pow(itemY - playerY, 2)
    );

    return distance;
  }

  getTile(x: number, y: number) {
    let index = y * this.width + x;
    return this.boardMap[index];
  }
}

const items = [
  {
    name: "sword",
    type: "weapon",
    rarity: "common",
    maxItem: 3,
    minItem: 1,
  },
  {
    name: "shield",
    type: "armor",
    rarity: "common",
    maxItem: 3,
    minItem: 0,
  },
];

const boardMapGenerator = new BoardMapGenerator();
boardMapGenerator.generate();
//boardMapGenerator.generateItems();

for (let i = 0; i < items.length; i++) {
  boardMapGenerator.addToBoard(items[i]);
}

boardMapGenerator.findSafeSpots();
boardMapGenerator.createPath();

boardMapGenerator.display();
