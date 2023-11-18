import { PinModel } from "./pin";

export class TripModel {
    id: number;
    authorId: number;
    name: string;
    description: string;
    pins: PinModel[];
    createDate: string;
}