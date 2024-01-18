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
import MazeRunner from "./pages/games/MazeRunner/MazeRunner";
import { Alert } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import ExampleGame from "./pages/games/ExampleGame/ExampleGame";
import HarmonyHaven from "./pages/games/HarmonyHaven/HarmonyHaven";
import CosmicHorrors from "./pages/games/CosmicHorrors/CosmicHorrors";

function App() {
  const [openAlert, setOpenAlert] = useState<boolean>(false);

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
      if (response.type === "disconnected") {
        setInLobby(false);
        setOpenAlert(true);
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

      setOpenAlert(true);
    };
  }, []); // empty dependency array ensures useEffect runs only once when the component mounts
  return (
    <>
      <div className="w-full min-h-screen">
        {!inLobby && <Home />}
        {inLobby && !inGame && <LobbyPage lobby={lobby} />}
        {inGame && lobby.game === "TwistedShadows" && <TwistedShadows />}
        {inGame && lobby.game === "MazeRunner" && <MazeRunner />}
        {inGame && lobby.game === "ExampleGame" && <ExampleGame />}
        {inGame && lobby.game === "HarmonyHaven" && <HarmonyHaven />}
        {inGame && lobby.game === "CosmicHorrors" && <CosmicHorrors />}
      </div>

      {openAlert && (
        <div className="absolute top-0 right-0 p-6">
          <Alert
            open={openAlert}
            onClose={() => setOpenAlert(false)}
            animate={{
              mount: { y: 0 },
              unmount: { y: 100 },
            }}
            icon={<InformationCircleIcon width={20} height={20} />}
            className="rounded-none border-l-4 border-[#ff0000] bg-[#ff0000]/10 font-medium text-[#ff0000]"
          >
            Looks like your internet connection is unstable. Please check your
            internet connection.
          </Alert>
        </div>
      )}
    </>
  );
}

export default App;
