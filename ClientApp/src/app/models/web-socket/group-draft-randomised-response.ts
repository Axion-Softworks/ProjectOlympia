import { AthleteGroup } from "../athlete-group";

export interface GroupDraftRandomisedResponse {
    draftId: string;
    athleteGroups: AthleteGroup[];
}