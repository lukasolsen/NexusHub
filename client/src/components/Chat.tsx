import React from "react";

const Chat: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img
          src="user-avatar.jpg" // Replace with the actual path to the user's avatar
          alt="User Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <h1 className="text-lg font-semibold">Lobby</h1>
      </div>
      <div className="overflow-y-auto max-h-40">
        {/* Message List */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-start">
            <img
              src="other-user-avatar.jpg" // Replace with the actual path to the other user's avatar
              alt="Other User Avatar"
              className="w-6 h-6 rounded-full mr-2"
            />
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <p className="text-sm">Hello there!</p>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="bg-gray-300 p-2 rounded-lg">
              <p className="text-sm">Hi! How can I help you?</p>
            </div>
          </div>
          {/* Add more messages here */}
        </div>
      </div>
      <div className="mt-4">
        {/* Message Input */}
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full border rounded p-2"
        />
      </div>
    </div>
  );
};

export default Chat;
