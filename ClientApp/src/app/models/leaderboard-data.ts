import { AthleteLeaderboardData } from "./athlete-leaderboard-data";

export interface LeaderboardData {
    userId: string;
    name: string;
    bronze: number;
    silver: number;
    gold: number;
    points: number;
    hexColour: string;
    athleteLeaderboardData: AthleteLeaderboardData[];
}