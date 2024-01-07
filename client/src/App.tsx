import { useEffect, useState } from "react";
import Home from "./pages/Home";
import LobbyPage from "./pages/Lobby";
import {
  connectDefaultSocket,
  disconnectDefaultSocket,
  subscribeToMessages,
  subscribeToMessage,
} from "./service/socketService";
import { Lobby } from "../../shared/types/lobby";
import { Data } from "../../shared/types/essential";
import TwistedShadows from "./pages/games/TwistedShadows/TwistedShadows";

function App() {
  const [inLobby, setInLobby] = useState<boolean>(false);
  const [inGame, setInGame] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby>({} as Lobby);

  useEffect(() => {
    console.log("Connecting socket");
    // Connect to the socket when the component mounts
    connectDefaultSocket();

    // Listen to incoming messages
    subscribeToMessages((message) => {
      console.log("Received message:", message);
    });

    subscribeToMessage("lobby", (response: Data) => {
      console.log("Received lobby:", response);
      if (response.type === "create") setInLobby(true);
      if (response.type === "join") setInLobby(true);
      if (response.type === "disconnected") setInLobby(false);
      if (response.type === "start") setInGame(true);
      setLobby(response.payload);
    });

    // Disconnect from the socket when the component unmounts
    return () => {
      console.log("Disconnecting socket");
      disconnectDefaultSocket();
    };
  }, []); // empty dependency array ensures useEffect runs only once when the component mounts
  return (
    <div className="w-full min-h-screen">
      {!inLobby && <Home />}
      {inLobby && !inGame && <LobbyPage lobby={lobby} />}
      {inGame && <TwistedShadows />}
    </div>
  );
}

export default App;
