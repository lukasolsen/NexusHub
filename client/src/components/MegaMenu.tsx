import { CogIcon } from "@heroicons/react/24/outline";
import {
  Collapse,
  ListItem,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { Fragment, createElement, useState } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const renderItems = menuItems.map((item, index: number) => (
    <MenuItem
      placeholder={"MenuItem"}
      className="flex items-center gap-3 rounded-lg"
      key={index}
      onClick={item.onClick}
      disabled={item.disabled}
    >
      <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2 ">
        {createElement(item.icon, {
          strokeWidth: 2,
          className: "h-6 text-gray-900 w-6",
        })}
      </div>
      <div>
        <Typography
          placeholder={"Typography"}
          variant="h6"
          color="blue-gray"
          className="flex items-center text-sm font-bold"
        >
          {item.title}
        </Typography>
        <Typography
          placeholder={"Typography"}
          variant="paragraph"
          className="text-xs !font-medium text-blue-gray-500"
        >
          {item.description}
        </Typography>
      </div>
    </MenuItem>
  ));

  return (
    <Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
      >
        <MenuHandler>
          <Typography
            as="div"
            variant="small"
            className="font-medium"
            placeholder={"Text"}
          >
            <ListItem
              placeholder={"ListItem"}
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              <CogIcon
                className="h-6 w-6 text-gray-600"
                style={{
                  transform: isMobileMenuOpen
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList
          className="hidden max-w-screen-xl rounded-xl lg:block"
          placeholder={"Menu List"}
        >
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </Fragment>
  );
};

export default UserMegaMenuComponent;
