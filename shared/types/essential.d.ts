import { Socket } from "socket.io";

export interface CustomSocket extends Socket {
  userId: string;
  name: string;
  role: "owner" | "mod" | "user"; // "owner", "mod", "user"
}

export interface Data {
  type: string; // "create" | "join" | "leave" | "message"
  payload: any;
}
