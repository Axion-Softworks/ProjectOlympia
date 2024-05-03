import { EPlace } from "./e-place";

export class Medal {
    id: string;
    discipline: string;
    place: EPlace;

    constructor(id: string, discipline: string, place: EPlace) {
        this.id = id;
        this.discipline = discipline;
        this.place = place;
    }
}