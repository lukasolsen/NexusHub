function tryTo(description: string, callback: () => boolean | void) {
  for (let timeout = 1000; timeout > 0; timeout--) {
    if (callback()) {
      return;
    }
  }
  throw "Timeout while trying to " + description;
}

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr: any[]) {
  let temp: any[], r: number;
  for (let i = 1; i < arr.length; i++) {
    r = randomRange(0, i);
    temp = arr[i];
    arr[i] = arr[r];
    arr[r] = temp;
  }
  return arr;
}

export { tryTo, randomRange, shuffle };
