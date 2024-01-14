import { Typography } from "@material-tailwind/react";
import type { FC } from "react";
import { memo } from "react";

export interface BoxProps {
  document: DocumentInformation;
  type: string;
  isDropped: boolean;
}

const DocumentComponent: FC<BoxProps> = memo(function Box({ document }) {
  return (
    <div data-testid="box" className="h-96 w-96 p-2 bg-gray-800 rounded-sm">
      {document?.id && (
        <div className="flex flex-col w-full justify-start h-full">
          <div className="flex flex-row justify-between items-center">
            <Typography placeholder={"Name"} variant="paragraph">
              {new Date(document?.date).toLocaleDateString()}
            </Typography>
            <Typography
              placeholder={"Type"}
              variant="paragraph"
              className="p-1 bg-green-600 rounded-md uppercase text-white font-semibold"
            >
              {document?.type}
            </Typography>
          </div>

          <Typography placeholder={"Content"} variant="paragraph">
            {document?.content}
          </Typography>
        </div>
      )}

      {!document.id && (
        <div>
          <Typography placeholder={"Name"} variant="paragraph">
            Document is illegal
          </Typography>
        </div>
      )}
    </div>
  );
});

export default DocumentComponent;
