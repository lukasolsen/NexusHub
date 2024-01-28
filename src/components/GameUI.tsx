import { useQuery } from "react-query";
import { getGame } from "../lib/api";

type GameUIProps = {
  gameId: string;
};

const GameUI: React.FC<GameUIProps> = ({ gameId }) => {
  const { data: gameData, status } = useQuery("game", () => getGame(gameId), {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {status === "loading" && <div>Loading...</div>}
      {status === "error" && <div>Error</div>}
      {status === "success" && (
        <>
          <div className="w-full h-full" id="app"></div>

          <script dangerouslySetInnerHTML={{ __html: gameData?.fileContent }} />
        </>
      )}
    </>
  );
};

export default GameUI;
