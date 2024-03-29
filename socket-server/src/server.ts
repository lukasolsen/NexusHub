import { createServer } from "https";
import { Server } from "socket.io";
import { generateUserId } from "./utils/id";
import LobbyManager from "./manager/LobbyManager";
import GameManager from "./manager/GameManager";
import SocketManager from "./SocketManager";
import { CustomSocket, Data } from "../../shared/types/essential";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

class ServerManager {
  private httpServer: any;
  private lobbyManager: LobbyManager;
  private gameManager: GameManager;

  constructor() {
    this.httpServer = createServer({
      key: readFileSync("shared/ssl/server.key"),
      cert: readFileSync("shared/ssl/server.cert"),
    });
    // Allow CORS
    this.httpServer.on("request", (req: any, res: any) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    });

    const io = new Server(this.httpServer, {});
    SocketManager.getInstance().initialize(io);

    this.lobbyManager = new LobbyManager();
    this.gameManager = GameManager.getInstance();

    io.on("connection", (socket: CustomSocket) => {
      socket.userId = generateUserId();
      socket.name = "User" + socket.userId;
      socket.role = "user";

      console.log("User with IP", socket.handshake.address, "connected");

      socket.on("lobby", (data: Data) => {
        this.lobbyManager.handleLobbyAction(socket, data);
      });

      socket.on("game", (data: Data) => {
        this.gameManager.handleGameAction(socket, data);
      });

      socket.on("disconnect", () => {
        this.lobbyManager.handleDisconnect(socket);
        this.gameManager.handleDisconnect(socket);
        console.log("User - " + socket.id + " disconnected");
      });
    });

    this.listen(process.env.HOST_IP, 3000);
  }

  private listen(ip: string, port: number) {
    this.httpServer.listen(port, ip, () => {
      console.log("Server is listening on port " + port);
    });
  }
}

new ServerManager();
