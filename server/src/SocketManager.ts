// SocketManager.ts

import { Server } from "socket.io";

class SocketManager {
  private static instance: SocketManager | null = null;
  private io: Server | null = null;

  private constructor() {
    // Prevent external instantiation
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public getSocketFromId(id: string): any {
    return this.io?.sockets.sockets.get(id);
  }

  public initialize(io: Server): void {
    this.io = io;
  }

  public getIO(): Server | null {
    return this.io;
  }

  getSocket(id: string): any {
    return this.io?.sockets.sockets.get(id);
  }
}

export default SocketManager;
