class ExampleGame {
  private gameId: string;
  protected lobbyId: string;

  constructor() {}

  handleDisconnect(socket: any): void {
    console.log("disconnected");
  }

  receiveEvent(socket: any, data: any): void {
    switch (data.type) {
      default:
        break;
    }
  }

  startGame(lobbyId: string, gameId: string): void {
    this.lobbyId = lobbyId;
    this.gameId = gameId;

    
  }
}

export default ExampleGame;
