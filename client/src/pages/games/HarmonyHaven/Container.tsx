import { memo, useEffect, useState } from "react";
import Droppable from "./components/Droppable";
import Item from "./components/Character";
import DocumentComponent from "./components/Document";

const randomCharacters: CharacterInformation[] = [
  {
    name: "John",
    birthdate: "01/01/2000",
    role: "Redident",
    id: Math.random().toString(),
  },
  {
    name: "Jane",
    birthdate: "01/01/2000",
    role: "Redident",
    id: Math.random().toString(),
  },
  {
    name: "Jack",
    birthdate: "01/01/2000",
    role: "Redident",
    id: Math.random().toString(),
  },
  {
    id: Math.random().toString(),
    name: "Feathers McGraw",
    role: "Villain",
    birthdate: "15/05/1990",
  },
];

const randomDocuments: DocumentInformation[] = [
  {
    id: Math.random().toString(),
    type: "application",
    content: "Application for a new job",
    date: "01/01/2000",
  },
  {
    id: Math.random().toString(),
    type: "permit",
    content: "Permit to drive a car",
    date: "01/01/2000",
  },
  {
    id: Math.random().toString(),
    type: "letter",
    content: "Letter from a friend",
    date: "01/01/2000",
  },
  {
    id: Math.random().toString(),
    type: "other",
    content: "Other document",
    date: "01/01/2000",
  },
];

export const Container: React.FC = memo(function Container() {
  const [character, setCharacters] = useState<CharacterInformation>(
    {} as CharacterInformation
  );
  const [document, setDocuments] = useState<DocumentInformation>(
    {} as DocumentInformation
  );
  const [droppedDroppable, setDroppedDroppable] = useState<string>("");
  const [droppedItem, setDroppedItem] = useState<any>(null);

  const handleDrop = (item: any, droppable: string) => {
    setDroppedItem(item);
    setDroppedDroppable(droppable);
  };

  const randomCharacter = () => {
    const randomIndex = Math.floor(Math.random() * randomCharacters.length);
    setCharacters(randomCharacters[randomIndex]);
  };

  const randomDocument = () => {
    const randomIndex = Math.floor(Math.random() * randomDocuments.length);
    setDocuments(randomDocuments[randomIndex]);
  };

  useEffect(() => {
    randomDocument();
  }, []);

  return (
    <>
      {/* Make a grid which will be divided in 3 sections in horizontal */}
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Left section */}
        <Droppable
          name="Left"
          style={{ height: "100%" }}
          onDrop={(item) => handleDrop(item, "Left")}
          lastDroppedItem={droppedDroppable === "Left" ? droppedItem : null}
        />

        {/* Items (Character, Document) */}

        <div className="flex flex-row justify-center items-center gap-6">
          <Item name="Item 1" type="box" isDropped={droppedItem || null} />
          <DocumentComponent
            document={document || null}
            isDropped={droppedItem || null}
            type="box"
          />
        </div>
        {/* Right section */}
        <Droppable
          name="Right"
          style={{ height: "100%" }}
          onDrop={(item) => handleDrop(item, "Right")}
          lastDroppedItem={droppedDroppable === "Right" ? droppedItem : null}
        />
      </div>
    </>
  );
});
