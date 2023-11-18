import { ParticipantModel } from "../users/participant";
import { ChipItem } from "./chip-item";

export class EventDetailsModel {
  id: number;
  title: string;
  description: string;
  author: string;
  image: string;
  createDate: Date;
  startDate: Date;
  endDate?: Date;

  places: ChipItem[];
  participants: ParticipantModel[];
}
