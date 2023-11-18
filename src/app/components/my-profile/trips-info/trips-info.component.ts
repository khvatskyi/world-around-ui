import { Component, OnInit, ViewChild } from '@angular/core';
import { PointModel } from 'src/app/models/map/point';
import { TripModel } from 'src/app/models/trips/tripModel';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { MapComponent } from '../../shared/map/map.component';

@Component({
  selector: 'app-trips-info',
  templateUrl: './trips-info.component.html',
  styleUrls: ['./trips-info.component.scss']
})
export class TripsInfoComponent implements OnInit {

  @ViewChild(MapComponent) map: MapComponent;

  userId: number;

  constructor(private readonly authService: AuthorizationService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  showTrip(trip: TripModel) {
    const waypoints = trip.pins.map(x => new PointModel(x.latitude, x.longitude));
    this.map.setWaypoints(waypoints);
  }
}
