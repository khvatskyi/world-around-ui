import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Subject, takeUntil } from 'rxjs';
import { TripsGateway } from 'src/app/gateways/trips-gateway.service';

@Component({
  selector: 'app-delete-trip-popup',
  templateUrl: './delete-trip-popup.component.html',
  styleUrls: ['./delete-trip-popup.component.scss']
})
export class DeleteTripPopupComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteTripPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly tripId: number,
    private readonly tripsGateway: TripsGateway) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel() {
    this.dialogRef.close(false);
  }

  deleteTrip() {
    this.tripsGateway.deleteTrip(this.tripId).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.dialogRef.close(true);
    })
  }
}
