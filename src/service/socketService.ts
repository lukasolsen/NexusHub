import { io } from "socket.io-client";
import { Data } from "../../../shared/types/essential";

const socket = io(`https://${import.meta.env.VITE_HOST_IP}:3000`, {
  transports: ["websocket"],
});

const getSocketId = () => {
  return socket.id;
};

const connectDefaultSocket = () => {
  socket.connect();
};

const disconnectDefaultSocket = () => {
  socket.disconnect();
};

const sendMessage = (message: string, payload: any) => {
  socket.emit(message, payload);
};

const subscribeToMessages = (callback: (message: string) => void) => {
  socket.on("message", (message) => {
    callback(message);
  });
};

const subscribeToMessage = (
  message: string,
  callback: (response: Data) => void
) => {
  socket.on(message, (response) => {
    callback(response);
  });
};

export {
  connectDefaultSocket,
  disconnectDefaultSocket,
  sendMessage,
  subscribeToMessages,
  subscribeToMessage,
  getSocketId,
};
