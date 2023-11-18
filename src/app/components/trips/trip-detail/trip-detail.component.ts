import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PinsGateway } from 'src/app/gateways/pins-gateway.service';
import { TripsGateway } from 'src/app/gateways/trips-gateway.service';
import { MapMode } from 'src/app/models/map/map-mode';
import { PointModel } from 'src/app/models/map/point';
import { UpdatePinModel } from 'src/app/models/pins/updatePin';
import { PinModel } from 'src/app/models/trips/pin';
import { TripModel } from 'src/app/models/trips/tripModel';
import { UpdateTripModel } from 'src/app/models/trips/updateTrip';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { MapComponent } from '../../shared/map/map.component';
import { DeleteTripPopupComponent } from './delete-trip-popup/delete-trip-popup.component';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit, OnDestroy {

  @ViewChild(MapComponent) map: MapComponent;

  trip: TripModel;
  sub: any;
  userId: number;

  edittingName: boolean = false;
  name: string = '';

  edittingDescription: boolean = false;
  description: string = '';

  edittingPin: boolean= false;
  pin: PinModel = {};
  mapMode: MapMode = MapMode.View;
  tripId: number;

  constructor(private readonly activateRoute: ActivatedRoute,
    private readonly tripsGateway: TripsGateway,
    private readonly pinsGateway: PinsGateway,
    private readonly toastr: ToastrService,
    private readonly authService: AuthorizationService,
    private readonly router: Router,
    private readonly dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    this.sub = this.activateRoute.params.subscribe(params => {
      this.tripId = params['id'];
      this.tripsGateway.getTrip(this.tripId).subscribe(data => {
        this.trip = data;

        this.setWaypoints();
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleNameEdit(): void {
    this.name = this.trip.name;
    this.edittingName = !this.edittingName;
  }

  editName(): void {
    this.tripsGateway.updateTripName(new UpdateTripModel(this.trip.id, this.name)).subscribe(() => {
      this.trip.name = this.name;
      this.toggleNameEdit();
    });
  }

  openDeleteTripPopup(): void {
    const dialogRef = this.dialog.open(DeleteTripPopupComponent, {
      width: '450px',
      data: this.trip.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Trip successfully deleted!', 'Success');
        this.router.navigate(['/my-profile']);
      }
    });
  }

  toggleDescriptionEdit(): void {
    this.description = this.trip.description;
    this.edittingDescription = !this.edittingDescription;
  }

  editDescription(): void {
    this.tripsGateway.updateTripDescription(new UpdateTripModel(this.trip.id, this.description)).subscribe(() => {
      this.trip.description = this.description;
      this.toggleDescriptionEdit();
    });
  }

  togglePinEdit(pinId: number): void {
    this.edittingPin = !this.edittingPin;
    this.mapMode = this.edittingPin ? MapMode.Update : MapMode.View;
    this.edittingPin
      ? this.map.enableClick()
      : this.map.disableClick()

    if(pinId > 0) {
      this.pin = Object.assign({}, this.trip.pins.find(x=>x.id == pinId));
      this.map.activeMarkerSeqNo = this.pin.seqNo - 1;
    } else if (pinId == 0) {
      this.pin.id = pinId;
      this.map.cancelUpdating();
    }
  }

  pinEdit(): void {
    const model: UpdatePinModel =  {
      id: this.pin.id,
      name: this.pin.name,
      description: this.pin.description,
      latitude: this.pin.latitude,
      longitude: this.pin.longitude
    };

    this.pinsGateway.updatePin(model).subscribe(() => {
      this.trip.pins[this.pin.seqNo - 1] = Object.assign({}, this.pin);
      this.togglePinEdit(-1);
      this.map.confirmUpdating();
      this.pin = {};
    })
  }

  updateCurrentPinCoords(point: PointModel): void {
    if(this.pin){
      this.pin.latitude = point.x;
      this.pin.longitude = point.y;
    }
  }

  private setWaypoints(): void {
    const waypoints = this.trip.pins.map(x => new PointModel(x.latitude, x.longitude));
    this.map.setWaypoints(waypoints);
  }
}
