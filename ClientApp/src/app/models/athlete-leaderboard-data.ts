import { Medal } from "./medal";

export interface AthleteLeaderboardData {
    athleteId: string;
    name: string;
    country: string;
    iso: string;
    bronze: number;
    silver: number;
    gold: number;
    points: number;
    medals: Medal[];
    discipline: string;
    description: string;
}