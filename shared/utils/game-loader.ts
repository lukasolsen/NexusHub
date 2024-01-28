import * as fs from "fs";
import * as path from "path";

const gamesPath = path.join(__dirname, "../../shared/games");

export const getManifest = (user_id: string, game_id: string) => {
  const gamePath = path.join(gamesPath, user_id, game_id);

  if (fs.lstatSync(gamePath).isDirectory()) {
    const manifestPath = path.join(gamePath, "/manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    return {
      name: manifest.name,
      description: manifest.description,

      // Assume each game has a unique identifier, replace it accordingly
      main: manifest.main,
      client: manifest?.client,

      file: game_id,
    };
  }
};

export const listGames = () => {
  // Loop inside the games folder, something to note is that the first of folders you'll see is user id folders. We need to go inside each folder, and then get the manifest.json file
  const users = fs.readdirSync(gamesPath);

  const games = users.reduce((acc, user) => {
    const userPath = path.join(gamesPath, user);
    const userGames = fs.readdirSync(userPath);

    const games = userGames.map((game) => {
      const manifest = getManifest(user, game);
      return {
        ...manifest,
        owner_id: user,
        id: game,
      };
    });

    return [...acc, ...games];
  }, []);

  return games;
};
