import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "./Navbar";
import { Outlet } from "@tanstack/react-router";

const Layout: React.FC = () => {
  return (
    <>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <Navbar />
          <hr className="border-gray-700" />

          <div className=" dark:bg-[#09090B] bg-white">
            <Outlet />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default Layout;
