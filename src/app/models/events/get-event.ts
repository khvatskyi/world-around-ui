import { UserModel } from "../users/user";

export class GetEventModel {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  createDate: Date;
  startDate: Date;
  endDate: Date;
  author: UserModel;
}
