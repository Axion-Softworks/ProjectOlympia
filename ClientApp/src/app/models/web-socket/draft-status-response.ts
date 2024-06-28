import { EDraftStatus } from "../e-draft-status";

export interface DraftStatusResponse {
    draftId: string;
    status: EDraftStatus;
}