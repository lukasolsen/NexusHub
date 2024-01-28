import { LockOpenIcon } from "@heroicons/react/20/solid";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";

export const RegisterRoute: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { registerUser } = useAuth();

  const sendRegisterRequest = async () => {
    const response = await registerUser(username, email, password);

    if (response) {
      const data = await response.json();
      console.log(data);
    }
  };

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="h-full w-full bg-gray-600" />
      <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
        <h1 className="font-bold text-lg">Register</h1>
        <p className="text-sm text-gray-400">
          Register with your username, email and password.
        </p>

        <div className="flex flex-col gap-2 w-4/12">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <Button
            onClick={() => {
              sendRegisterRequest();
            }}
          >
            Register
          </Button>
          <p className="text-sm text-gray-400 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
