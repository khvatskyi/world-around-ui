import { Accessibility } from "src/app/enums/event-accessibility";
import { ParticipantModel } from "../users/participant";

export class UpdateEventModel {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  accessibility: Accessibility = 1;
  image: File | ArrayBuffer | string;
  Trips: { id: number, name: string }[];
  Participants: ParticipantModel[];
}
