export class GetEventsOptions {
  searchValue: string;
  userId: number;
  isOwner: boolean;
  accessibility: number;
  pageIndex: number;
  pageSize: number

  public constructor(init?: Partial<GetEventsOptions>) {
    Object.assign(this, init);
  }
}
