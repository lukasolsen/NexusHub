import * as fs from "fs";
import * as path from "path";

const gamesPath = path.join(__dirname, "../../shared/games");

export const listManifests = () => {
  const folders = fs.readdirSync(gamesPath);

  return folders.map((file) => {
    // Only find folders, go into the folder and read the manifest.json and look for "main" field and load that file
    if (fs.lstatSync(path.join(gamesPath, file)).isDirectory()) {
      const manifestPath = path.join(gamesPath, file + "/manifest.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

      return {
        name: manifest.name,
        description: manifest.description,

        // Assume each game has a unique identifier, replace it accordingly
        main: manifest.main,
        client: manifest?.client,

        file: file,
      };
    }
  });
};

export const getManifest = (game: string) => {
  const manifests = listManifests();

  return manifests.find((manifest) => manifest.name === game);
};
