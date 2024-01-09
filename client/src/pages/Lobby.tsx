import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  Switch,
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  ButtonGroup,
} from "@material-tailwind/react";
import { Lobby } from "../../../shared/types/lobby";
import { User } from "../../../shared/types/user";
import { sendMessage } from "../service/socketService";

type LobbyPageProps = {
  lobby: Lobby;
};

const LobbyPage: React.FC<LobbyPageProps> = ({ lobby }) => {
  const [activeGame, setActiveGame] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const handleBanUser = () => {
    // Implement ban user logic
    console.log(`Banning user: ${selectedUser?.name}`);
    // Close the modal
    setSelectedUser(null);
  };

  const handleKickUser = () => {
    // Implement kick user logic
    console.log(`Kicking user: ${selectedUser?.name}`);
    // Close the modal
    setSelectedUser(null);
  };

  return (
    <div className=" container mx-auto w-full p-8">
      <h1 className="text-3xl font-bold mb-4">Lobby</h1>

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <Typography color="gray" placeholder="Code" variant="h4">
            {lobby.id}
          </Typography>
        </div>

        <div className="grid grid-cols-5 grid-rows-1 gap-6">
          {lobby.users.map((player) => (
            <Card
              placeholder={"Card"}
              key={player.id}
              className="flex flex-col items-center justify-center p-2"
              onClick={() => setSelectedUser(player)}
            >
              <CardBody
                className="flex flex-col items-center justify-center w-full h-full p-6"
                placeholder={"CardBody"}
              >
                <Avatar
                  placeholder={"Avatar"}
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.id}`}
                  alt={player.name}
                  size="xl"
                />
                <div className="mt-2">{player.name}</div>
                <Badge
                  content={player.role}
                  color={
                    (player.role === "mod" && "blue") ||
                    (player.role === "owner" && "red") ||
                    "green"
                  }
                  className="rounded-md"
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-row items-center justify-between">
        <div className="flex items-center gap-6">
          <Typography color="gray" placeholder="Lobby Status" className="mr-4">
            Lobby Status:
          </Typography>
          <Switch
            crossOrigin={"anonymous"}
            onChange={() => setIsPublic(!isPublic)}
            checked={isPublic}
            color="indigo"
          />
          <Typography color="gray" placeholder="Lobby Status">
            {isPublic ? "Public" : "Private"}
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
              onClick={() => sendMessage("lobby", { type: "start" })}
            >
              Start Game
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Games</h2>
        <div className="grid grid-cols-3 grid-rows-3 h-full gap-12">
          {/* Replace these image URLs with your actual image URLs */}
          {lobby?.games &&
            lobby.games.map((_, index) => (
              <Card
                placeholder={"Game " + index}
                key={index}
                className={`w-full h-40 relative shadow-xl hover:shadow-lg transition-shadow duration-300 ${
                  activeGame === "game" + index
                    ? "shadow-green-500 "
                    : "shadow-none"
                } hover:shadow-green-200 cursor-pointer`}
                onClick={() => setActiveGame("game" + index)}
                style={{
                  backgroundImage: `url(https://via.assets.so/game.png?id=${index}&q=95&w=360&h=360&fit=fill)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Typography color="gray" placeholder={"Title"}>
                    {_}
                  </Typography>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* User Actions Modal */}
      <Dialog
        size="sm"
        active={!!selectedUser}
        toggler={() => setSelectedUser(null)}
      >
        <DialogBody placeholder={"Dialog"}>
          <Typography
            placeholder={"Actions for User"}
            color="gray"
            className="text-center"
          >
            {`Actions for ${selectedUser?.name}`}
          </Typography>
        </DialogBody>
        <DialogFooter placeholder={"Footer"}>
          <Menu>
            <MenuHandler color="indigo" buttonType="filled" ripple="light">
              Actions
            </MenuHandler>
            <MenuList placeholder={"List"}>
              <MenuItem
                color="lightBlue"
                ripple="light"
                onClick={handleBanUser}
              >
                Ban User
              </MenuItem>
              <MenuItem color="rose" ripple="light" onClick={handleKickUser}>
                Kick User
              </MenuItem>
            </MenuList>
          </Menu>
          <Button
            color="indigo"
            onClick={() => setSelectedUser(null)}
            placeholder={"Close"}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default LobbyPage;
