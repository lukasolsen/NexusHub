import { Button, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { sendMessage } from "../service/socketService";

const Home: React.FC = () => {
  const [lobbyCode, setLobbyCode] = useState<string>("");

  return (
    <div className="container mx-auto w-full flex flex-row justify-between gap-12">
      <div className="flex w-full justify-center flex-col">
        <Typography placeholder={"Join"}>Join a lobby</Typography>
        <Input
          crossOrigin={"anonymous"}
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          label="Enter Lobby Code"
        />
        <Button
          placeholder={"Join"}
          onClick={() => {
            sendMessage("lobby", {
              type: "join",
              payload: { id: lobbyCode },
            });
          }}
        >
          Join
        </Button>
      </div>

      <div className="flex w-full justify-center flex-col">
        <Typography placeholder={"Create Lobby"}>Create a lobby</Typography>

        <Button
          placeholder={"Create"}
          onClick={() => {
            sendMessage("lobby", { type: "create" });
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default Home;
