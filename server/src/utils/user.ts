import { User } from "../../../shared/types/user";
import { CustomSocket } from "../../../shared/types/essential";

const turnToUser = (socket: CustomSocket): User => {
  return {
    id: socket.id,
    userId: socket.userId,
    name: socket.name,
    role: socket.role,
  };
};

export default turnToUser;
