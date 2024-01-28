import { Request, Response, Router } from "express";
import { PostgresSource } from "../../../../shared/database/db";
import Game from "../../../../shared/models/Game";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

type File = Record<string, any>;

const router = Router();

interface User {
  id: string;
}

router.get("/", async (req: Request, res: Response) => {
  res.send("Hello world!");
});

router.post("/upload", async (req: Request, res: Response) => {
  const user = (await req.user) as User;

  if (!req.user || !user.id) {
    res.send("User not found");
    return;
  }

  const files = req.files as unknown as File;

  if (!req.files) {
    res.send("No files were uploaded.");
    return;
  }

  const gameFolder = files.file;

  // Accept only zip files
  if (!gameFolder || gameFolder.mimetype !== "application/x-zip-compressed") {
    res.send("Invalid file type");
    return;
  }

  const zip = new AdmZip(gameFolder.data);

  const zipEntries = zip.getEntries();
  if (zipEntries.length === 0) {
    res.send("Invalid zip file");
    return;
  } else if (
    zipEntries.find((entry) => entry.name === "manifest.json") === undefined
  ) {
    res.send("Invalid zip file");
    return;
  }

  const manifestFile = zipEntries.find(
    (entry) => entry.name === "manifest.json"
  );

  const manifestJson = JSON.parse(
    zip.readAsText(manifestFile.entryName, "utf8")
  );
  console.log(manifestJson);

  const gameRepo = PostgresSource.getRepository(Game);

  const game = new Game();

  game.name = manifestJson.name || "My Game";
  game.description = manifestJson.description || "My Game Description";
  game.version = manifestJson.version || "1.0.0";
  game.owner_id = user.id;
  console.log(game);

  await gameRepo.save(game);

  fs.mkdirSync(
    path.join(__dirname, "../../../../shared/games", user.id.toString()),
    {
      recursive: true,
    }
  );

  zip.extractAllTo(
    path.join(
      __dirname,
      "../../../../shared/games",
      user.id.toString(),
      game.id.toString()
    ),
    true
  );
});

router.get("/games", async (req: Request, res: Response) => {
  const user = (await req.user) as User;

  if (!req.user || !user.id) {
    res.send("User not found");
    return;
  }

  const gameRepo = PostgresSource.getRepository(Game);

  // Display all games that is in the repo
  const games = await gameRepo.find();

  res.send(games);
});

router.get("/games/:id", async (req: Request, res: Response) => {
  const user = (await req.user) as User;

  if (!req.user || !user.id) {
    res.send("User not found");
    return;
  }

  const gameRepo = PostgresSource.getRepository(Game);

  // Display all games that is in the repo
  const game = await gameRepo.findOne({
    where: { id: parseInt(req.params.id) },
  });

  // Find the game in the game files.
  // If it exists, send it the avaliable information from the database and the client javascript file.

  if (!game) {
    res.send("Game not found");
    return;
  }

  const gameFolder = path.join(
    __dirname,
    "../../../../shared/games",
    game.owner_id.toString(),
    game.id.toString()
  );

  const gameFiles = fs.readdirSync(gameFolder);

  const manifestFile = gameFiles.find((file) => file === "manifest.json");

  if (!manifestFile) {
    res.send("Game not found");
    return;
  }

  const data = JSON.parse(
    fs.readFileSync(path.join(gameFolder, manifestFile), "utf-8")
  );

  const clientFile = data.client;

  // Check if file exists.
  // If it does, send it.

  if (!clientFile || !fs.existsSync(path.join(gameFolder, clientFile))) {
    res.status(401).send("Game not found");
    return;
  }

  const client = fs.readFileSync(path.join(gameFolder, clientFile), "utf-8");

  res.send({
    data: game,
    fileContent: client,
  });
});

export const gameRouter = router;
