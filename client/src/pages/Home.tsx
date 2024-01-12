import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Collapse,
  Input,
  List,
  Typography,
} from "@material-tailwind/react";
import { sendMessage, subscribeToMessage } from "../service/socketService";
import LobbyItemComponent from "../components/LobbyItem";
import { Lobby } from "../../../shared/types/lobby";

const Home: React.FC = () => {
  const [displayTitle, setDisplayTitle] = useState<boolean>(false);

  const [openAccordion, setOpenAccordion] = useState<number>(0);

  const [selectedInformation, setSelectedInformation] = useState<string>("");
  const [lobbyCode, setLobbyCode] = useState<string>("");

  const [publicLobbies, setPublicLobbies] = useState<Lobby[]>([]);
  useEffect(() => {
    subscribeToMessage("lobby", (data) => {
      switch (data.type) {
        case "getPublicLobbies":
          setPublicLobbies(data.payload);
          break;
        default:
          break;
      }
    });
  });

  useEffect(() => {
    sendMessage("lobby", { type: "getPublicLobbies" });
  }, [openAccordion]);

  return (
    <div className="container mx-auto w-full gap-12">
      {/* Main Content */}
      <Button
        onClick={() => setDisplayTitle(!displayTitle)}
        variant="text"
        placeholder={"Button for title"}
        className="w-full text-center"
      >
        <Typography placeholder={"Title"} variant="h3">
          Welcome to NexusHub
        </Typography>
      </Button>
      <Collapse open={displayTitle} className="text-center">
        <Typography placeholder={"Description"}>
          NexusHub is a platform for playing multiplayer games with your
          friends.
        </Typography>
      </Collapse>

      {!selectedInformation && (
        <div className="flex flex-row">
          <div className="flex flex-col gap-4 w-3/12">
            <Button
              onClick={() => setSelectedInformation("join")}
              variant="text"
              placeholder={"Button"}
            >
              Join Lobby
            </Button>
            <Button
              onClick={() => {
                sendMessage("lobby", { type: "create" });
              }}
              variant="text"
              placeholder={"Button"}
            >
              Create Lobby
            </Button>
          </div>
          <div>
            <Accordion
              open={openAccordion === 1}
              placeholder={"Public Lobbies"}
            >
              <AccordionHeader
                onClick={() => setOpenAccordion(openAccordion === 1 ? 0 : 1)}
                placeholder={"Open Public Lobbies"}
              >
                Public Lobbies
              </AccordionHeader>
              <AccordionBody>
                <List placeholder={"Public Lobbies"}>
                  {publicLobbies &&
                    publicLobbies.map((lobby) => (
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
                    ))}

                  {publicLobbies.length === 0 && (
                    <Typography
                      placeholder={"No Public Lobbies"}
                      variant="paragraph"
                      className="text-center"
                    >
                      No public lobbies available
                    </Typography>
                  )}
                </List>
              </AccordionBody>
            </Accordion>
          </div>
        </div>
      )}

      {selectedInformation === "join" && (
        <div className="flex flex-col gap-2 w-6/12 mx-auto items-center h-full">
          <Input
            crossOrigin={"anonymous"}
            type="text"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            label="Lobby Code"
          />
          <Button
            onClick={() => {
              sendMessage("lobby", { type: "join", lobbyId: lobbyCode });
            }}
            variant="text"
            placeholder={"Button"}
          >
            Join
          </Button>
        </div>
      )}

      {/* Version of the thing */}
      <div className="absolute bottom-0 left-0 p-2">
        <Typography
          placeholder={"Version"}
          variant="h6"
          className="text-teal-500"
        >
          v40
        </Typography>
      </div>
    </div>
  );
};

export default Home;
