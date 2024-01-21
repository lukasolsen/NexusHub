import React, { useEffect, useState } from "react";
import { sendMessage, subscribeToMessage } from "../service/socketService";
import LobbyItemComponent from "../components/LobbyItem";
import { Lobby } from "../../../shared/types/lobby";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "../components/ui/accordion";
import { Input } from "../components/ui/input";

const Home: React.FC = () => {
  const [selectedInformation, setSelectedInformation] = useState<string>("");
  const [lobbyCode, setLobbyCode] = useState<string>("");

  const [publicLobbies, setPublicLobbies] = useState<Lobby[]>([]);
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
  }, []);

  return (
    <div className="container mx-auto w-full gap-12">
      <h1>Welcome to NexusHub</h1>
      <p>
        NexusHub is a platform for playing multiplayer games with your friends.
      </p>

      {!selectedInformation && (
        <div className="flex flex-row">
          <div className="flex flex-col gap-4 w-3/12">
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
          <div>
            <h3>Public Lobbies</h3>
            <Accordion collapsible type="single">
              <AccordionItem value="public-lobbies"></AccordionItem>

              {publicLobbies &&
                publicLobbies.map((lobby) => (
                  <AccordionContent>
                    <LobbyItemComponent
                      key={lobby.id}
                      lobby={lobby}
                      onClick={() => {
                        sendMessage("lobby", {
                          type: "join",
                          lobbyId: lobby.id,
                        });
                      }}
                    />
                  </AccordionContent>
                ))}

              {publicLobbies.length === 0 && (
                <h3 className="text-center">No public lobbies available</h3>
              )}
            </Accordion>
          </div>
        </div>
      )}

      {selectedInformation === "join" && (
        <div className="flex flex-col gap-2 w-6/12 mx-auto items-center h-full">
          <Input
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            placeholder="Lobby Code"
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
