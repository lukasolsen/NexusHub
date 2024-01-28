import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChatTypes, getChatStyle } from "../../shared/utils/chat";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";

interface Chat {
  type: (typeof ChatTypes)[keyof typeof ChatTypes];
  message: string;

  // Optional
  avatar?: string;
  alt?: string;
}

const Chat: React.FC = () => {
  const chats: Chat[] = [
    {
      type: ChatTypes.ANNOUNCEMENT,
      message: "Welcome to the chat!",
    },
    {
      type: ChatTypes.WARNING,
      message: "Please do not share any personal information.",
    },
    {
      type: ChatTypes.USER_MESSAGE,
      message: "Hello!",

      avatar: "https://avatars.githubusercontent.com/u/25190563?v=4",
      alt: "User avatar",
    },
  ];

  const displayChatMessage = (chat: Chat) => {
    const chatStyle = getChatStyle(chat.type);

    return (
      <div className={chatStyle.className}>
        <div
          className={chatStyle.messageStyle}
          style={
            chat.avatar
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: ".8rem",
                  alignItems: "center",
                }
              : undefined
          }
        >
          {/* Avatar */}
          {chat.avatar && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={chat.avatar} alt={chat.alt} />
              <AvatarFallback>{chat.alt?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          {/* Message */}
          <p className={chatStyle.textStyle}>{chat.message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 left-4 p-4 rounded-lg shadow-md border-2">
      <div className="overflow-y-auto max-h-64 min-h-64">
        {/* Message List */}
        <div className="flex flex-col space-y-2">
          {chats.map((chat, index) => (
            <React.Fragment key={index}>
              {displayChatMessage(chat)}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-row items-center justify-between">
        {/* Message Input */}
        <Input
          type="text"
          placeholder="Enter your message..."
          className="w-full rounded-r-none"
        />
        <Button className="rounded-l-none" variant={"outline"}>
          <SendIcon size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
