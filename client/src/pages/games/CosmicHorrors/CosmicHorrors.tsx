import { useEffect, useState } from "react";
import { subscribeToMessage } from "../../../service/socketService";
import { Square2StackIcon, CloudIcon } from "@heroicons/react/20/solid";
import { motion, useAnimation } from "framer-motion";

const CosmicHorrors: React.FC = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const controls = useAnimation();

  useEffect(() => {
    subscribeToMessage("game", (data) => {
      console.log(data);

      switch (data.type) {
        case "board":
          setBoard(data.payload.board);
          controls.start({ opacity: 1 });
          break;
      }
    });

    return () => {};
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0 }}
      className="flex flex-col gap-1"
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((cell, cellIndex) => (
            <motion.div
              key={cellIndex}
              className="p-2 rounded-md bg-gray-200"
              whileHover={{ scale: 1.1 }}
            >
              {cell === "Wall" ? (
                <Square2StackIcon className="text-4xl text-red-600 w-8" />
              ) : (
                <CloudIcon className="text-4xl text-blue-500 w-8" />
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default CosmicHorrors;
