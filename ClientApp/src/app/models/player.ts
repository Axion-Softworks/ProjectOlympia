import { Athlete } from "./athlete";

export class Player {
    id: string;
    name: string;
    athletes: Athlete[];

    constructor(id: string, name: string, athletes: Athlete[]) {
        this.id = id;
        this.name = name;
        this.athletes = athletes;
    }
}