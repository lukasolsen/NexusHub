export const ChatTypes = {
  ANNOUNCEMENT: "ANNOUNCEMENT",
  WARNING: "WARNING",
  USER_MESSAGE: "USER_MESSAGE",
  CURRENT_USER_MESSAGE: "CURRENT_USER_MESSAGE",
  SYSTEM_MESSAGE: "SYSTEM_MESSAGE",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INFO: "INFO",
} as const;

export type ChatType = (typeof ChatTypes)[keyof typeof ChatTypes];

export const getChatStyle = (chatType: ChatType) => {
  switch (chatType) {
    case ChatTypes.ANNOUNCEMENT:
      return {
        className: "flex items-center justify-center",
        messageStyle: "text-blue-500 p-2 rounded-lg",
        textStyle: "text-sm",
        position: "center",
        background: true,
      };

    case ChatTypes.WARNING:
      return {
        className: "flex items-center justify-center",
        messageStyle: "text-red-400 p-2 rounded-lg",
        textStyle: "text-sm",
        position: "center",
        background: true,
      };

    case ChatTypes.CURRENT_USER_MESSAGE:
      return {
        className: "flex items-end justify-end",
        messageStyle: "text-green-500 p-2 rounded-lg",
        textStyle: "text-sm",
        position: "right",
        background: true,
      };

    case ChatTypes.USER_MESSAGE:
      return {
        className: "flex items-center justify-start",
        messageStyle: "text-blue-500 p-2 rounded-lg",
        textStyle: "text-sm",
        position: "right",
        background: true,
      };

    default:
      return {
        className: "flex items-center justify-start",
        messageStyle: "p-2 rounded-lg",
        textStyle: "text-sm",
        position: "center",
        background: false,
      };
  }
};
