import { Accessibility } from "src/app/enums/event-accessibility";
import { ChipItem } from "./chip-item";

export class CreateEventModel {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  accessibility: Accessibility = 1;
  createUserId: number;
  image: File;
  places: ChipItem[] = [];
  participants: number[] = [];
}
