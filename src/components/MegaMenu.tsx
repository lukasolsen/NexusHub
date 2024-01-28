import { CogIcon } from "@heroicons/react/24/outline";
import { Fragment, createElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NavListItem = {
  title: string;
  description: string;
  onClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  disabled?: boolean;
};

type UserMegaMenuComponentProps = {
  menuItems: NavListItem[];
};

const UserMegaMenuComponent: React.FC<UserMegaMenuComponentProps> = ({
  menuItems,
}) => {
  const renderItems = menuItems.map((item, index: number) => (
    <DropdownMenuItem
      key={index}
      onClick={item.onClick}
      disabled={item.disabled}
    >
      {createElement(item.icon, { className: "w-6 h-6 mr-2" })}
      <div className="flex flex-col">
        <h6>{item.title}</h6>
        <p className="text-xs text-gray-400">{item.description}</p>
      </div>
    </DropdownMenuItem>
  ));

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CogIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {renderItems}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};

export default UserMegaMenuComponent;
