import { Lobby } from "../../../shared/types/lobby";
import { Button } from "./ui/button";

type LobbyItemProps = {
  lobby: Lobby;
  onClick: () => void;
};

const LobbyItemComponent: React.FC<LobbyItemProps> = ({ lobby, onClick }) => {
  return (
    <Button
      key={lobby.id}
      className="flex flex-row items-center justify-between gap-6 w-full rounded-sm p-4 cursor-pointer hover:bg-blue-gray-50"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <h4 color="gray">
          {lobby.name}
        </h4>
        <h4 color="gray">
          {lobby.users.length} / 10
        </h4>
      </div>
      <h4 color="gray">
        {lobby.isPublic ? "Public" : "Private"}
      </h4>
    </Button>
  );
};

export default LobbyItemComponent;
