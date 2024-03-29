import React, { useState } from "react";
import { Lobby } from "../../../shared/types/lobby";
import { getSocketId, sendMessage } from "../service/socketService";
import UserComponent from "../components/User";
import GameComponent from "../components/Game";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import Chat from "../components/Chat";
import { useQuery } from "react-query";
import { getGames } from "../lib/api";

type LobbyPageProps = {
  lobby: Lobby;
};

const LobbyPage: React.FC<LobbyPageProps> = ({ lobby }) => {
  const { data: games, status } = useQuery("games", getGames, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const [activeGame, setActiveGame] = useState<any>({} as any);

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

  console.log(games);

  const displayGames = () => {
    return (
      games &&
      games.map((_, index: number) => (
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
      <div className="flex flex-row items-center justify-between gap-6 w-full">
        <div className="flex flex-col">
          <h4 color="gray">{lobby.id}</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {displayUsers()}
        </div>
      </div>

      <div className="mt-8 flex flex-row items-center justify-between">
        <div className="flex items-center gap-6">
          <p color="gray" className="mr-4">
            Lobby Status:
          </p>
          <Switch
            onCheckedChange={() => {
              sendMessage("lobby", {
                type: "settings",
                payload: { isPublic: !lobby.isPublic },
              });
            }}
            checked={lobby?.isPublic}
            color="indigo"
          />
          <p color="gray">{lobby?.isPublic ? "Public" : "Private"}</p>
        </div>
        <div>
          <div className="flex flex-row gap-1">
            <Button
              color="indigo"
              onClick={() => sendMessage("lobby", { type: "disconnect" })}
              className="rounded-r-none"
            >
              Disconnect
            </Button>
            <Button
              color="indigo"
              onClick={() =>
                sendMessage("lobby", { type: "start", game: activeGame.name })
              }
              className="rounded-l-none"
            >
              Start Game
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-12">
          {games && games.length === 0} <h3>No games</h3>
          {games && games.length !== 0 && displayGames()}
        </div>
      </div>

      <Chat />
    </div>
  );
};

export default LobbyPage;
