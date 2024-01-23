import { Link, Outlet, RootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "./components/theme-provider";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";

const activeLinkClasses = "[&.active]:font-bold [&.active]:text-blue-300";

const Navbar = () => (
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
        <Link to="/login" className={`mx-2 ${activeLinkClasses} flex flex-row`}>
          <UserIcon className="h-6 w-6" />
        </Link>
      </div>
    </div>
  </div>
);

export const rootRoute = new RootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="system">
        <Navbar />
        <hr className="border-gray-700" />

        <div className=" dark:bg-[#09090B] bg-white">
          <Outlet />
        </div>
      </ThemeProvider>
    </>
  ),
});

export default rootRoute;
