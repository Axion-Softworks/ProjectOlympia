import { Medal } from "./medal";

export class Athlete {
    id: string;
    name: string;
    description: string;
    discipline: string;
    country: string;
    medals: Medal[];

    constructor(id: string, name: string, descripton: string, discipline: string, country: string, medals: Medal[]) {
        this.id = id;
        this.name = name;
        this.description = descripton;
        this.discipline = discipline;
        this.country = country;
        this.medals = medals;
    }
}