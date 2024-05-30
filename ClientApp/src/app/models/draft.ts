import { User } from "./user";
import { Athlete } from "./athlete";

export interface Draft {
    id: string;
    name: string;
    users: User[];
    athletes: Athlete[];
}