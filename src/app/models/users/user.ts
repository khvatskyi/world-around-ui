export class UserModel {

  public id: number;
  public userName: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public imagePath: string;

  constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
  }
}
