import { Medal } from "./medal";

export class Athlete {
    id: string;
    name: string;
    description: string;
    medals: Medal[];

    constructor(id: string, name: string, descripton: string, medals: Medal[]) {
        this.id = id;
        this.name = name;
        this.description = descripton;
        this.medals = medals;
    }
}