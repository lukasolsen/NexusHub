import React, { useEffect, useState } from "react";
import { sendMessage, subscribeToMessage } from "../service/socketService";
import LobbyItemComponent from "../components/LobbyItem";
import { Lobby } from "../../../shared/types/lobby";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionItem,
} from "../components/ui/accordion";
import { Input } from "../components/ui/input";

const Home: React.FC = () => {
  const [selectedInformation, setSelectedInformation] = useState<string>("");
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [publicLobbies, setPublicLobbies] = useState<Lobby[]>([]);
  const [showPublicLobbies, setShowPublicLobbies] = useState<boolean>(false);

  useEffect(() => {
    sendMessage("lobby", { type: "getPublicLobbies" });

    subscribeToMessage("lobby", (data) => {
      switch (data.type) {
        case "getPublicLobbies":
          setPublicLobbies(data.payload);
          break;
        default:
          break;
      }
    });
  }, [showPublicLobbies]);

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4">Welcome to NexusHub</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        NexusHub is a platform for playing multiplayer games with your friends.
      </p>

      {!selectedInformation && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 md:w-1/3">
            <Button onClick={() => setSelectedInformation("join")}>
              Join Lobby
            </Button>
            <Button
              onClick={() => {
                sendMessage("lobby", { type: "create" });
              }}
            >
              Create Lobby
            </Button>
          </div>
          <div className="md:w-2/3">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-2xl font-bold mb-4">Public Lobbies</h3>
              <Button
                onClick={() => {
                  setShowPublicLobbies(!showPublicLobbies);
                }}
              >
                Refresh
              </Button>
            </div>
            <Accordion collapsible type="single">
              <AccordionItem value="public-lobbies">
                {publicLobbies &&
                  publicLobbies.map((lobby) => (
                    <LobbyItemComponent
                      lobby={lobby}
                      onClick={() => {
                        sendMessage("lobby", {
                          type: "join",
                          lobbyId: lobby.id,
                        });
                      }}
                      key={lobby.id}
                    />
                  ))}

                {publicLobbies.length === 0 && (
                  <h3 className="text-center">No public lobbies available</h3>
                )}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}

      {selectedInformation === "join" && (
        <div className="flex flex-col items-center mt-8 md:w-1/2 mx-auto">
          <Input
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            placeholder="Enter Lobby Code"
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage("lobby", {
                  type: "join",
                  lobbyId: lobbyCode,
                });
              }
            }}
          />
          <Button
            onClick={() => {
              sendMessage("lobby", { type: "join", lobbyId: lobbyCode });
            }}
          >
            Join
          </Button>
        </div>
      )}

      {/* Version of the thing */}
      <div className="absolute bottom-0 left-0 p-2">
        <h6 className="text-teal-500">v40</h6>
      </div>
    </div>
  );
};

export default Home;
