import React, { useState } from "react";
import {
  Switch,
  Typography,
  Button,
  ButtonGroup,
} from "@material-tailwind/react";
import { Lobby } from "../../../shared/types/lobby";
import { getSocketId, sendMessage } from "../service/socketService";
import UserComponent from "../components/User";
import GameComponent from "../components/Game";

type LobbyPageProps = {
  lobby: Lobby;
};

const LobbyPage: React.FC<LobbyPageProps> = ({ lobby }) => {
  const [activeGame, setActiveGame] = useState<string>("");

  const displayUsers = () => {
    const currentPlayerRole = lobby.users.find(
      (user) => user.id === getSocketId()
    )?.role;

    return lobby.users.map((player, index: number) => (
      <UserComponent
        key={index}
        player={player}
        currentPlayerRole={currentPlayerRole}
      />
    ));
  };

  const displayGames = () => {
    return (
      lobby.games &&
      lobby.games.map((_, index: number) => (
        <GameComponent
          key={index}
          _={_}
          index={index}
          activeGame={activeGame}
          setActiveGame={setActiveGame}
        />
      ))
    );
  };

  return (
    <div className=" container mx-auto w-full p-8">
      <h1 className="text-3xl font-bold mb-4">Lobby</h1>

      <div className="flex flex-row items-center justify-between gap-6 w-full">
        <div className="flex flex-col">
          <Typography color="gray" placeholder="Code" variant="h4">
            {lobby.id}
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {displayUsers()}
        </div>
      </div>

      <div className="mt-8 flex flex-row items-center justify-between">
        <div className="flex items-center gap-6">
          <Typography color="gray" placeholder="Lobby Status" className="mr-4">
            Lobby Status:
          </Typography>
          <Switch
            crossOrigin={"anonymous"}
            onChange={() => {
              sendMessage("lobby", {
                type: "settings",
                payload: { isPublic: !lobby.isPublic },
              });
            }}
            checked={lobby?.isPublic ? true : false || false}
            color="indigo"
          />
          <Typography color="gray" placeholder="Lobby Status">
            {lobby?.isPublic ? "Public" : "Private"}
          </Typography>
        </div>
        <div>
          <ButtonGroup placeholder={"ButtonGroup"}>
            <Button
              color="indigo"
              placeholder="Disconnect"
              onClick={() => sendMessage("lobby", { type: "disconnect" })}
            >
              Disconnect
            </Button>
            <Button
              color="indigo"
              placeholder="Start Game"
              onClick={() =>
                sendMessage("lobby", { type: "start", game: activeGame })
              }
            >
              Start Game
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-12">
          {displayGames()}
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
