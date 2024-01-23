import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import UserMenu from "./UserMenu";

export const Navbar = () => {
  const { checkToken, userDetails } = useAuth();
  const activeLinkClasses = "[&.active]:font-bold [&.active]:text-blue-300";

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="p-2 flex flex-col md:flex-row items-center md:justify-center dark:bg-[#09090B]">
      <div className="w-8/12 justify-between flex flex-row items-center">
        <div className="flex items-center justify-between w-4/12">
          <Link to="/" className="font-semibold text-3xl text-white">
            NexusHub
          </Link>
          <Link
            to="/"
            className={`mx-2 ${activeLinkClasses} flex flex-row items-center gap-2`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="hidden md:inline">Home</span>
          </Link>
        </div>
        <div className="flex items-center">
          {userDetails?.id ? (
            <UserMenu email="" id="" username={userDetails?.username} />
          ) : (
            <Link
              to="/login"
              className={`mx-2 ${activeLinkClasses} flex flex-row`}
            >
              <UserIcon className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
