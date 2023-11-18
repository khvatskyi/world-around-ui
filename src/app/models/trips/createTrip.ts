import { PinModel } from "./pin";

export class CreateTripModel {
    authorId?: number;
    name?: string;
    description?: string;
    pins: PinModel[];
}
