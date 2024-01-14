import { useDrop } from "react-dnd";

type DroppableProps = {
  collection: string;
  style: any;
  onDrop: (item: any) => void;
  lastDroppedItem: any;
};

const Droppable: React.FC<DroppableProps> = ({
  collection,
  style,
  onDrop,
  lastDroppedItem,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "box",
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
      {isActive ? "Release to drop" : "information" + ` accepts: everything`}

      {lastDroppedItem && <p>Last dropped: {lastDroppedItem}</p>}
    </div>
  );
};

export default Droppable;
