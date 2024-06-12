import { User } from "./user";
import { Athlete } from "./athlete";
import { EDraftStatus } from "./e-draft-status";

export interface Draft {
    id: string;
    name: string;
    users: User[];
    athletes: Athlete[];
    status: EDraftStatus;
    draftOrder: string[];
}