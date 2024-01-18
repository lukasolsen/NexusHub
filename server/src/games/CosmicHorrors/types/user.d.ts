import { User } from "../../../../../shared/types/user";

export interface PlayerSocket extends User {
  dead: boolean;
}
