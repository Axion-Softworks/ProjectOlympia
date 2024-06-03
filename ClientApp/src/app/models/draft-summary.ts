import { EDraftStatus } from "./e-draft-status";

export interface DraftSummary {
    id: string;
    name: string;
    userCount: number;
    athleteCount: number;
    status: EDraftStatus;
}