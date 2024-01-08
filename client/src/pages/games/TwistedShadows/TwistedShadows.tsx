import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Input } from "@material-tailwind/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import {
  sendMessage,
  subscribeToMessage,
} from "../../../service/socketService";
import { Data } from "../../../../../shared/types/essential";
import BoardMinimap from "./Board";

type Board = {
  tiles: string[];
  width: number;
  height: number;
};

const TwistedShadows: React.FC = () => {
  const [command, setCommand] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState<string>("");
  const [terminalTexts, setTerminalTexts] = useState<string[]>([
    "You have been selected for a critical mission to explore the uncharted depths of the abyss, a mysterious and otherworldly environment.",
    "Your mission is presented as a noble endeavor to retrieve valuable data and gather insights for the betterment of humanity.",
    "Your journey begins by navigating through the abyss, solving puzzles, and interacting with terminals to fulfill your assigned objectives.",
    "An AI companion provides dynamic audio narration, guiding you through the environment, offering insights, and providing mission updates.",
  ]);
  const [board, setBoard] = useState<Board>({} as Board);

  const controls = useAnimation();

  const animateText = async (text: string) => {
    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 25));
      setCurrentText((prevText) => prevText + text[i]);
    }

    setHistory((prevHistory) => [...prevHistory, text]);
  };

  useEffect(() => {
    const animateTerminalTexts = async () => {
      for (let i = 0; i < terminalTexts.length; i++) {
        setCurrentText("");
        await animateText(terminalTexts[i]);
      }
      setCurrentText("");
    };

    animateTerminalTexts();
  }, []);

  useEffect(() => {
    subscribeToMessage("game", async (data: Data) => {
      switch (data.type) {
        case "command":
          await animateText(data.payload);
          setCurrentText("");
          break;

        case "board":
          setBoard(data.payload);
          break;
        case "status": {
          const status = data.payload;

          if (!status?.dead) {
            await animateText("You died.");
            setCurrentText("");
          }
          break;
        }
        default:
          break;
      }
    });
  }, []);

  return (
    <div className="bg-black text-green-500 min-h-screen p-4 border-4 border-gray-500 flex flex-row gap-10">
      <BoardMinimap board={board} />
      <div className="flex flex-col justify-between h-full w-8/12">
        <div
          className="flex flex-col gap-1 font-mono h-full overflow-y-auto"
          style={{ minHeight: "80vh" }}
        >
          {/* Use Framer Motion motion.div for animations */}
          {...history.map((text, index) => (
            <motion.div
              key={index}
              color="green"
              className="font-vt323Regular"
              animate={controls}
            >
              {text}
            </motion.div>
          ))}

          <motion.div
            color="green"
            className="font-vt323Regular"
            placeholder={"Test"}
            animate={controls}
          >
            {currentText}
          </motion.div>
        </div>

        <div className="flex flex-row gap-1">
          <Input
            crossOrigin={"anonymous"}
            color="green"
            className="font-vt323Regular text-white"
            label="Command"
            variant="static"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage("game", { type: "command", payload: command });
                setCommand("");
              }
            }}
          />

          <IconButton
            color="green"
            ripple="light"
            className="font-vt323Regular"
            variant="text"
          >
            <MagnifyingGlassIcon className="w-6 h-6 text-green-600" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default TwistedShadows;
