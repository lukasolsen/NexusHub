import { Link, Outlet, RootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "./components/theme-provider";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";

const activeLinkClasses = "[&.active]:font-bold [&.active]:text-blue-300";

const Navbar = () => (
  <div className="p-2 flex flex-col md:flex-row items-center md:justify-between bg-gray-800">
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
      <Link to="/about" className={`mx-2 ${activeLinkClasses} flex flex-row`}>
        <UserIcon className="h-6 w-6" />
      </Link>
    </div>
  </div>
);

export const rootRoute = new RootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="system">
        <Navbar />
        <hr className="border-gray-700" />
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </ThemeProvider>
    </>
  ),
});

export default rootRoute;
