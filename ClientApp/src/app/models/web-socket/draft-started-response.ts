import { EDraftStatus } from "../e-draft-status";

export interface DraftStartedResponse {
    draftId: string;
    status: EDraftStatus;
}