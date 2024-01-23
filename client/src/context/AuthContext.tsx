import { createContext, useContext, useState } from "react";
import { login, register, currentUser } from "../lib/api";

// Create a new context
type AuthContextType = {
  isLoggedIn: boolean;
  userDetails: { username: string; email: string; id: string } | null;
  checkToken: () => void;
  isLoading: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginUser: (username: string, password: string) => Promise<any>;
  registerUser: (username: string, email: string, password: string) => void;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // You can define functions to update the state here if needed

  const checkToken = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      setIsLoading(false);
      setUserDetails(null);
      return;
    }

    currentUser(token).then((response) => {
      if (!response) return;
      if (response.code === "OK") {
        setIsLoggedIn(true);
        setUserDetails(response.data);
      } else {
        setIsLoggedIn(false);
        setUserDetails(null);
      }
      setIsLoading(false);
    });
  };

  const loginUser = async (username: string, password: string) => {
    const response = await login(username, password);
    if (!response) return;
    if (response.status === 200) {
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      checkToken();
    }

    return response;
  };

  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await register(username, password, email);
    if (!response) return;
    if (response.status === 200) {
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      checkToken();
    }
  };

  // Provide the context values to the components
  const contextValue = {
    isLoggedIn,
    userDetails,
    checkToken,
    isLoading,

    loginUser,
    registerUser,
  };

  console.log(userDetails);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
