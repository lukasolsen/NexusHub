import { User } from "../../../../../shared/types/user";

export interface Player extends User {
  dead: boolean;
  isFinished: boolean;

  position: {
    x: string;
    y: string;
  };
}
