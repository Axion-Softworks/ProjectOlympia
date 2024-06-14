import { Medal } from "./medal";

export interface Athlete {
    id: string;
    forename: string;
    surname: string;
    description: string;
    discipline: string;
    country: string;
    countryCode: string;
    iso: string;
    medals: Medal[];
    userId: string;
    group: number;
}