import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TripsGateway } from 'src/app/gateways/trips-gateway.service';
import { GetTripsParams } from 'src/app/models/trips/getTripsParams';
import { TripModel } from 'src/app/models/trips/tripModel';

@Component({
  selector: 'app-trips-grid',
  templateUrl: './trips-grid.component.html',
  styleUrls: ['./trips-grid.component.scss']
})
export class TripsGridComponent implements OnInit, OnChanges {

  @Input() width: string = "880px";
  @Input() height: string = "auto";
  @Input() userId: number;
  @Input() searchValue: string;
  @Input() includePins: boolean = false;
  @Input() autoLoad: boolean = true;

  @Output() dataLoaded: EventEmitter<number> = new EventEmitter<number>();
  @Output() tripClick: EventEmitter<TripModel> = new EventEmitter<TripModel>();

  trips: TripModel[] = [];
  length: number = 0;

  params: GetTripsParams = {
    pageSize: 5,
    pageIndex: 0,
    includePins: this.includePins
  };

  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private readonly tripsGateway: TripsGateway) { }

  ngOnInit(): void {

    if (this.autoLoad) {
      this.updateInfo();
    }
  }

  ngOnChanges(): void {
    this.params.includePins = this.includePins;
    this.updateInfo();
  }

  updatePage(event: any): void {

    this.params.pageIndex = event.pageIndex;
    this.params.pageSize = event.pageSize;

    this.getTrips();
  }

  getTrips(): void {

    this.tripsGateway.getTrips(this.params).subscribe(data => {
      this.trips = data.data;
      this.length = data.length;
      this.dataLoaded.emit(data.length);
    });
  }

  onTripClick(trip: any) {
    this.tripClick.emit(trip);
  }

  private updateInfo(): void {

    if (this.userId) {
      this.params.userId = this.userId;
    }

    if (this.searchValue) {
      this.params.searchValue = this.searchValue;
    }

    this.getTrips();
  }
}