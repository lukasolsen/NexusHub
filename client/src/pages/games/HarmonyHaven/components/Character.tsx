import { Typography } from "@material-tailwind/react";
import type { FC } from "react";
import { memo } from "react";
import { useDrag } from "react-dnd";

export interface BoxProps {
  name: string;
  type: string;
  isDropped: boolean;
}

const Item: FC<BoxProps> = memo(function Box({ name, type, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type]
  );

  return (
    <div
      ref={drag}
      style={{ opacity }}
      data-testid="box"
      className="h-48 w-48 p-2 bg-[#faebd7]"
    >
      <div className="flex flex-col w-full">
        <Typography placeholder={"Name"} variant="paragraph">
          {name}
        </Typography>
        <div className="flex flex-row">
          <Typography placeholder={"Type"} variant="paragraph">
            {type}
          </Typography>
          <Typography placeholder={"Is Dropped"} variant="paragraph">
            {isDropped}
          </Typography>
        </div>
      </div>
    </div>
  );
});

export default Item;
