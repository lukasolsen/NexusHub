import { Card, Typography } from "@material-tailwind/react";
import { Lobby } from "../../../shared/types/lobby";

type LobbyItemProps = {
  lobby: Lobby;
  onClick: () => void;
};

const LobbyItemComponent: React.FC<LobbyItemProps> = ({ lobby, onClick }) => {
  return (
    <Card
      placeholder={"Card"}
      key={lobby.id}
      className="flex flex-row items-center justify-between gap-6 w-full rounded-sm p-4 cursor-pointer hover:bg-blue-gray-50"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <Typography color="gray" placeholder="Code" variant="h4">
          {lobby.name}
        </Typography>
        <Typography color="gray" placeholder="Code" variant="h4">
          {lobby.users.length} / 10
        </Typography>
      </div>
      <Typography color="gray" placeholder="Code" variant="h4">
        {lobby.isPublic ? "Public" : "Private"}
      </Typography>
    </Card>
  );
};

export default LobbyItemComponent;
