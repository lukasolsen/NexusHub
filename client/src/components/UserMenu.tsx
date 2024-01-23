import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import { User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

type UserMenuProps = {
  username: string;
  email: string;
  id: string;
};

const UserMenu: React.FC<UserMenuProps> = ({ username }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"ghost"}>
          <UserIcon className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-transparent flex flex-col gap-2">
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={"/about"}>
          <DropdownMenuItem className="flex flex-row gap-2 justify-center items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
