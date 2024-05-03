import { EPlace } from "./e-place";

export class Medal {
    id: string;
    event: string;
    place: EPlace;

    constructor(id: string, event: string, place: EPlace) {
        this.id = id;
        this.event = event;
        this.place = place;
    }
}