import { motion } from "framer-motion";

// Import SVG
import Quicksand from "../../../assets/icons/quicksand.svg";

type Board = {
  tiles: string[];
  width: number;
  height: number;
};

type BoardMinimapProps = {
  board: Board | undefined;
};

const BoardMinimap: React.FC<BoardMinimapProps> = ({ board }) => {
  const getTileStyle = (tileType: string) => {
    switch (tileType) {
      case "wall":
        return {
          backgroundColor: "gray",
        };
      case "monster":
        return {
          backgroundColor: "red",
        };
      case "player":
        return {
          backgroundColor: "blue",
        };
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  return (
    <div className="w-4/12 h-full items-center">
      {/* Display board */}
      {!board && <div className="text-center text-white">Loading...</div>}
      {board && board.tiles && board.tiles.length > 0 && (
        <div className="grid grid-cols-10 gap-1 h-full">
          {board.tiles.map((tile, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center lg:h-12 lg:w-12 w-12 h-12 sm:w-6 sm:h-6 md:h-8 md:w-8 border border-gray-500"
              style={getTileStyle(tile === "WALL" ? "wall" : "tile")}
              whileHover={{ scale: 1.1 }}
            >
              {/* You can customize the content/icon based on tile type */}
              {tile === "MONSTER" && "👾"}
              {tile.includes("X") && "👤"}
              {tile === "QUICKSAND_QUAGMIRE" && (
                <img src={Quicksand} className="h-6 w-6" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardMinimap;
