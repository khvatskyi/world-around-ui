import { PagingModel } from "../paging/paging";
import { UserModel } from "./user";

export class GetUsersPageModel {
  users: UserModel[];
  pageInfo: PagingModel;
}
