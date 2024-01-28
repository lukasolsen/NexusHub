import { Lobby } from "../../../shared/types/lobby";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type LobbyItemProps = {
  lobby: Lobby;
  onClick: () => void;
};

const LobbyItemComponent: React.FC<LobbyItemProps> = ({ lobby, onClick }) => {
  return (
    <Button
      key={lobby.id}
      className="flex flex-row items-center justify-between gap-6 w-full rounded-sm p-4 cursor-pointer hover:bg-blue-gray-50 bg-transparent border-2 border-blue-500 text-white font-semibold hover:border-blue-600"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <h4 color="gray">{lobby.name}</h4>
        <h4 color="gray">{lobby.users.length} / 10</h4>
      </div>
      <Badge
        color="gray"
        variant={"default"}
        className="bg-green-200 hover:bg-green-200 rounded-sm text-black font-semibold"
      >
        {lobby.isPublic ? "Public" : "Private"}
      </Badge>
    </Button>
  );
};

export default LobbyItemComponent;
