import { User } from "../../../../../shared/types/user";

export interface Player extends User {
  dead: boolean;
}