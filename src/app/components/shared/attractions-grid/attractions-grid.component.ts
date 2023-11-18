import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AttractionsGateway } from 'src/app/gateways/attractions.gateway';
import { AttractionModel } from 'src/app/models/attractions/attractionModel';
import { GetAttractionsModel } from 'src/app/models/attractions/getAttractionsModel';
import { GetAttractionsParams } from 'src/app/models/attractions/getAttractionsParams';

@Component({
  selector: 'app-attractions-grid',
  templateUrl: './attractions-grid.component.html',
  styleUrls: ['./attractions-grid.component.scss']
})
export class AttractionsGridComponent implements OnInit, OnChanges {

  @Input() width: string = "880px";
  @Input() height: string = "auto";
  @Input() userId: number;
  @Input() searchValue: string;
  @Input() autoLoad: boolean = true;

  @Output() dataLoaded: EventEmitter<number> = new EventEmitter<number>();

  attractions: AttractionModel[] = [];
  length: number = 0;

  params: GetAttractionsParams = {
    pageSize: 5,
    pageIndex: 0
  };

  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private readonly attractionsGateway: AttractionsGateway) { }

  ngOnInit(): void {

    if (this.autoLoad) {
      this.updateInfo();
    }
  }

  ngOnChanges(): void {
    this.updateInfo();
  }

  updatePage(event: any): void {

    this.params.pageIndex = event.pageIndex;
    this.params.pageSize = event.pageSize;

    this.getAttractions();
  }

  getAttractions(): void {

    this.attractionsGateway.getAttractions(this.params).subscribe(data => {
      if (!data) {
        data = {
          data: [],
          length: 0
        };
      }

      this.attractions = data.data;
      this.length = data.length;
      this.dataLoaded.emit(data.length);
    });
  }

  private updateInfo(): void {

    if (this.userId) {
      this.params.userId = this.userId;
    }

    if (this.searchValue) {
      this.params.searchValue = this.searchValue;
    }

    this.getAttractions();
  }
}
