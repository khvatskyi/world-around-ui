import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { IEquipment } from 'src/app/models/equipment/equipment.model';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  newEquipment: string;

  @Input({ required: true }) eventId!: number;

  equipments: IEquipment[] = [];

  constructor(private readonly service: EquipmentService) { }

  ngOnInit(): void {
    this.service.getEquipments(this.eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => this.equipments = result);
  }

  onAdd(): Subscription {
    return this.service.addEquipment(this.eventId, this.newEquipment)
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.equipments.push({
          id,
          name: this.newEquipment
        })
        this.newEquipment = null;
      });
  }

  onDelete(equipmentId: number): Subscription {
    return this.service.deleteEquipment(this.eventId, equipmentId).pipe(takeUntil(this.destroy$)).subscribe(() => {
      const index = this.equipments.map(x => x.id).indexOf(equipmentId);
      this.equipments.splice(index, 1);
    });
  }

  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete();
  }
}
