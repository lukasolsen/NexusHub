import { LockOpenIcon } from "@heroicons/react/20/solid";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";

export const LoginRoute: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { loginUser } = useAuth();

  const sendLoginRequest = async () => {
    const response = await loginUser(username, password);

    if (response?.code === "OK") {
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      location.href = "/";
    }
  };

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="h-full w-full bg-gray-600" />
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <h1 className="font-bold text-lg">Login</h1>
        <p className="text-sm text-gray-400">Login to your NexusHub account</p>

        <div className="flex flex-col gap-2 w-4/12">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent"
          />
          <div className="flex flex-row items-center">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent"
            />
            <Button variant={"ghost"} aria-label="Show password">
              <LockOpenIcon className="h-5 w-5 text-gray-400" />
            </Button>
          </div>

          <Button onClick={() => sendLoginRequest()}>Login</Button>
          <p className="text-sm text-gray-400 mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
