/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNode, useEffect, useState } from "react";
import Home from "../pages/Home";
import LobbyPage from "../pages/Lobby";
import {
  connectDefaultSocket,
  disconnectDefaultSocket,
  subscribeToMessage,
} from "../service/socketService";
import { Lobby } from "../../../shared/types/lobby";
import { Data } from "../../../shared/types/essential";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

function App() {
  const [inLobby, setInLobby] = useState<boolean>(false);
  const [inGame, setInGame] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>({} as Lobby);
  const [game, setGame] = useState<string>("");
  const [Comp, setComponent] = useState<ReactNode>();

  useEffect(() => {
    console.log("Connecting socket");
    // Connect to the socket when the component mounts
    connectDefaultSocket();

    subscribeToMessage("lobby", (response: Data) => {
      console.log("Received lobby:", response);
      if (response.type === "create") setInLobby(true);
      if (response.type === "join") setInLobby(true);
      if (response.type === "disconnected") {
        setInLobby(false);
        toast("You have been disconnected from the lobby");
      }
      if (response.type === "start") {
        setInGame(true);

        setGame(response.payload.gameData?.client);
      }
      setLobby(response.payload);
    });

    // Disconnect from the socket when the component unmounts
    return () => {
      console.log("Disconnecting socket");
      disconnectDefaultSocket();

      setInLobby(false);
      setInGame(false);

      setLobby({} as Lobby);
      toast("You have been disconnected from the lobby");
    };
  }, []);

  useEffect(() => {
    const loadComponent = async () => {
      if (game) {
        console.log("Loading game:", game);
        const Comp = await import(`../../../../shared/games/${game}`);
        setComponent(() => Comp.default);
      }
    };

    loadComponent();
  }, [game]);

  return (
    <>
      <div className="w-full min-h-screen">
        {!inLobby && <Home />}
        {inLobby && !inGame && <LobbyPage lobby={lobby} />}

        {inGame && game && <div className="w-full h-full">{Comp}</div>}
      </div>

      <Toaster />
    </>
  );
}

export default App;
