import { Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  sendMessage,
  subscribeToMessage,
} from "../../../service/socketService";

const ExampleGame: React.FC = () => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    subscribeToMessage("message", (data) => {
      setMessages((messages) => [...messages, data.payload.message]);
      console.log("Received message:", data);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* ChatBox */}
      <div className="flex flex-col gap-2 bg-blue-gray-800 text-white p-4 h-64 w-64 rounded-sm">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}

        <Input
          label="Message"
          crossOrigin={""}
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage("game", {
                type: "chat_message",
                payload: { message: inputMessage },
              });
              setInputMessage("");
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExampleGame;
