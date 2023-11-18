export class GetTripsParams {
    userId?: number;
    searchValue?: string;
    pageIndex: number;
    pageSize: number;
    includePins?: boolean;
}