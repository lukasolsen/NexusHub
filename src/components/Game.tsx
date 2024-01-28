import { Card } from "./ui/card";

type GameComponentProps = {
  index: number;
  activeGame: any;
  setActiveGame: (game: string) => void;
  _: any;
};

const GameComponent: React.FC<GameComponentProps> = ({
  _,
  activeGame,
  index,
  setActiveGame,
}) => {
  return (
    <Card
      key={index}
      className={`w-full h-40 relative rounded-sm border-4 hover:border-indigo-300 transition-all duration-300 border-gray-700 cursor-pointer ${
        activeGame.id === _.id && "border-indigo-500"
      }`}
      onClick={() => setActiveGame(_)}
      style={{
        backgroundImage: `url(https://via.assets.so/game.png?id=${index}&q=95&w=360&h=360&fit=fill)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bottom-0 right-0 left-0 w-full text-center bg-opacity-50 bg-gray-900 p-2">
        <h6 color="white" className="font-normal">
          {_.name}
        </h6>
      </div>
    </Card>
  );
};

export default GameComponent;
