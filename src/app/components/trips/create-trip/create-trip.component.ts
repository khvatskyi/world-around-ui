import { Component, ViewChild } from '@angular/core';
import { TripsGateway } from 'src/app/gateways/trips-gateway.service';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { CreateTripModel } from 'src/app/models/trips/createTrip';
import { MapComponent } from 'src/app/components/shared/map/map.component';
import { PinModel } from 'src/app/models/trips/pin';
import { PointModel } from 'src/app/models/map/point';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss']
})
export class CreateTripComponent {

  @ViewChild(MapComponent) map: MapComponent;

  trip: CreateTripModel = {
    pins: [],
    authorId: this.authService.getUserId()
  };
  currentPin: PinModel = {
    seqNo: this.getSeqNo()
  };

  constructor(
    private readonly tripsGateway: TripsGateway,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly authService: AuthorizationService) { }

  updateCurrentPinCoords(point: PointModel) {
    this.currentPin.latitude = point.x;
    this.currentPin.longitude = point.y;
  }

  savePin(): void {
    if (!this.validatePin()) {
      return;
    }

    this.map.saveActiveMarker();

    this.trip.pins.push(Object.assign({}, this.currentPin));
    this.currentPin = {
      seqNo: this.getSeqNo()
    };
  }

  saveTrip(): void {
    if (!this.validateTrip()) {
      return;
    }

    this.tripsGateway.createTrip(this.trip).subscribe(() => {
      this.toastr.success('You have successfuly created new Trip!', 'Success')
      this.router.navigate(['/my-profile']);
    });
  }

  cancel(): void {
    this.router.navigate(['/my-profile']);
    this.toastr.info('You have canceled Trip Creation.', 'Canceled')
  }

  private validatePin(): boolean {
    if (!this.currentPin.latitude || !this.currentPin.longitude) {
      this.toastr.error('Coordinates of pin should not be empty. Please choose pin on map.', 'Validation error');
      return false;
    }

    return true;
  }

  private validateTrip(): boolean {
    if (!this.trip.name) {
      this.toastr.error('Trip name should not be empty.', 'Validation error');
      return false;
    }

    if (!this.trip.description) {
      this.toastr.error('Trip description should not be empty.', 'Validation error');
      return false;
    }

    if (this.trip.pins.length < 2) {
      this.toastr.error('Trip should have at least 2 pins.', 'Validation error');
      return false;
    }

    return true;
  }

  private getSeqNo(): number {
    return this.trip.pins.length
      ? Math.max(...this.trip.pins.map(o => o.seqNo)) + 1
      : 1;
  }
}
