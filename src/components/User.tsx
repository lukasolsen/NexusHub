import UserMegaMenuComponent from "./MegaMenu";
import { User } from "../../../shared/types/user";
import { useState } from "react";
import {
  ArrowUpCircleIcon,
  UserMinusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { sendMessage } from "../service/socketService";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

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
        key={player.id}
        className="flex flex-col items-center justify-center relative select-none bg-transparent"
        onClick={() => {
          setMenuVisible(!menuVisible);
        }}
      >
        <CardHeader>
          <div className="flex flex-row gap-2 justify-between items-center">
            {player.name}
            {currentPlayerRole === "owner" && player.role !== "owner" && (
              <UserMegaMenuComponent menuItems={menuItems} />
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.id}`}
              alt={player.name}
            />
            <AvatarFallback>{player.name}</AvatarFallback>
          </Avatar>
        </CardContent>

        <CardFooter className="flex flex-row gap-4 justify-evenly p-1 w-full h-full">
          <Badge
            style={{
              backgroundColor:
                player.role === "owner"
                  ? "red"
                  : player.role === "mod"
                    ? "green"
                    : "blue",
            }}
            content={
              player.role === "owner"
                ? "Owner"
                : player.role === "mod"
                  ? "Moderator"
                  : "User"
            }
            color={
              player.role === "owner"
                ? "bg-red-500"
                : player.role === "mod"
                  ? "bg-green-500"
                  : "bg-blue-500"
            }
            className="rounded-sm"
            variant={"default"}
          >
            {player.role === "owner"
              ? "Owner"
              : player.role === "mod"
                ? "Moderator"
                : "User"}
          </Badge>
        </CardFooter>
      </Card>
    </>
  );
};

export default UserComponent;
