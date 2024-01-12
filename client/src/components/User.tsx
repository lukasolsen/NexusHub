import { Avatar, Badge, Card, CardBody } from "@material-tailwind/react";
import UserMegaMenuComponent from "./MegaMenu";
import { User } from "../../../shared/types/user";
import { useState } from "react";
import {
  ArrowUpCircleIcon,
  UserMinusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { sendMessage } from "../service/socketService";

type UserProps = {
  player: User;
  currentPlayerRole?: string;
};

const UserComponent: React.FC<UserProps> = ({ player, currentPlayerRole }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    {
      title: "Ban",
      description: "Ban the user from the lobby",
      onClick: () => {
        sendMessage("lobby", {
          type: "banUser",
          payload: { userId: player?.id },
        });
        setMenuVisible(false);
      },
      icon: XCircleIcon,
      disabled: player?.role === "owner",
    },
    {
      title: "Kick",
      description: "Kick the user from the lobby",
      onClick: () => {
        sendMessage("lobby", {
          type: "kickUser",
          payload: { userId: player?.id },
        });
        setMenuVisible(false);
      },
      icon: UserMinusIcon,
      disabled: player?.role === "owner",
    },
    {
      title: "Give Owner",
      description: "Give the user ownership of the lobby",
      onClick: () => {
        sendMessage("lobby", {
          type: "giveOwner",
          payload: { userId: player?.id },
        });
        setMenuVisible(false);
      },
      icon: ArrowUpCircleIcon,
    },
  ];

  return (
    <>
      <Card
        placeholder={"Card"}
        key={player.id}
        className="flex flex-col items-center justify-center p-2 relative select-none"
        onClick={() => {
          setMenuVisible(!menuVisible);
        }}
      >
        <CardBody
          className="flex flex-col items-center justify-center w-full h-full p-6 relative"
          placeholder={"CardBody"}
        >
          <Avatar
            placeholder={"Avatar"}
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.id}`}
            alt={player.name}
            size="xl"
          />

          <div className="flex flex-row gap-2 justify-between items-center">
            {player.name}
            {currentPlayerRole === "owner" && player.role !== "owner" && (
              <UserMegaMenuComponent menuItems={menuItems} />
            )}
          </div>
          <Badge
            content={player.role}
            color={
              (player.role === "mod" && "blue") ||
              (player.role === "owner" && "red") ||
              "green"
            }
            className="rounded-sm mt-4 absolute"
          />
        </CardBody>
      </Card>
    </>
  );
};

export default UserComponent;
