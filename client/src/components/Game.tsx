import { Card, Typography } from "@material-tailwind/react";

type GameComponentProps = {
  index: number;
  activeGame: string;
  setActiveGame: (game: string) => void;
  _: string;
};

const GameComponent: React.FC<GameComponentProps> = ({
  _,
  activeGame,
  index,
  setActiveGame,
}) => {
  return (
    <Card
      placeholder={"Game " + index}
      key={index}
      className={`w-full h-40 relative rounded-sm border-4 hover:border-indigo-300 transition-all duration-300 border-gray-700 cursor-pointer ${
        activeGame === _ && "border-indigo-500"
      }`}
      onClick={() => setActiveGame(_)}
      style={{
        backgroundImage: `url(https://via.assets.so/game.png?id=${index}&q=95&w=360&h=360&fit=fill)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bottom-0 right-0 left-0 w-full text-center bg-opacity-50 bg-gray-900 p-2">
        <Typography
          color="white"
          placeholder={"Title"}
          variant="h6"
          className="font-normal"
        >
          {_}
        </Typography>
      </div>
    </Card>
  );
};

export default GameComponent;
