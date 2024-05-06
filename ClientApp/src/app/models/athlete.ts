import { Medal } from "./medal";

export class Athlete {
    id: string;
    forename: string;
    surname: string;
    description: string;
    discipline: string;
    country: string;
    countryCode: string;
    iso: string;
    medals: Medal[];

    constructor(id: string, forename: string, surname: string, descripton: string, discipline: string, country: string, countryCode: string, iso: string, medals: Medal[]) {
        this.id = id;
        this.forename = forename;
        this.surname = surname;
        this.description = descripton;
        this.discipline = discipline;
        this.country = country;
        this.countryCode = countryCode;
        this.iso = iso;
        this.medals = medals;
    }
}