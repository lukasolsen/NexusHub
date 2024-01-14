import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Droppable from "./components/Droppable";
import Item from "./components/Character";
import { Container } from "./Container";

const HarmonyHaven: React.FC = () => {
  const [subtitles, setSubtitles] = useState<string[]>([]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="bg-[#333] text-[#b0b0b0] h-screen">
          <div className="container mx-auto h-3/5">
            <Container />

            {/* Subtitles */}
            {subtitles && (
              <div className="absolute bottom-2 left-0 right-0 border-2 border-gray-900 w-6/12 m-auto">
                <p>Subtitles</p>
              </div>
            )}
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default HarmonyHaven;
