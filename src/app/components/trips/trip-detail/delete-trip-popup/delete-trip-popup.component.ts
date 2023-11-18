import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripsGateway } from 'src/app/gateways/trips-gateway.service';

@Component({
  selector: 'app-delete-trip-popup',
  templateUrl: './delete-trip-popup.component.html',
  styleUrls: ['./delete-trip-popup.component.scss']
})
export class DeleteTripPopupComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteTripPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly tripId: number,
    private readonly tripsGateway: TripsGateway) { }

  cancel() {
    this.dialogRef.close(false);
  }

  deleteTrip() {
    this.tripsGateway.deleteTrip(this.tripId).subscribe(() => {
      this.dialogRef.close(true);
    })
  }
}
