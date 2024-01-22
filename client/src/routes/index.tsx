import { useEffect, useState } from "react";
import Home from "../pages/Home";
import LobbyPage from "../pages/Lobby";
import {
  connectDefaultSocket,
  disconnectDefaultSocket,
  subscribeToMessage,
} from "../service/socketService";
import { Lobby } from "../../../shared/types/lobby";
import { Data } from "../../../shared/types/essential";
import TwistedShadows from "../pages/games/TwistedShadows/TwistedShadows";
import CosmicHorrors from "../pages/games/CosmicHorrors/CosmicHorrors";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

function App() {
  const [inLobby, setInLobby] = useState<boolean>(false);
  const [inGame, setInGame] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>({} as Lobby);

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
      if (response.type === "start") setInGame(true);
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
  }, []); // empty dependency array ensures useEffect runs only once when the component mounts
  return (
    <>
      <div className="w-full min-h-screen">
        {!inLobby && <Home />}
        {inLobby && !inGame && <LobbyPage lobby={lobby} />}
        {inGame && lobby.game === "TwistedShadows" && <TwistedShadows />}
        {inGame && lobby.game === "CosmicHorrors" && <CosmicHorrors />}
      </div>

      <Toaster />
    </>
  );
}

export default App;
