import { Athlete } from "./athlete";
import { DraftSummary } from "./draft-summary";

export interface User {
    id: string;
    username: string;
    athletes: Athlete[];
    drafts: DraftSummary[];
}