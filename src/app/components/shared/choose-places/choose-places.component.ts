import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ItemType } from 'src/app/enums/item-type';
import { AttractionsGateway } from 'src/app/gateways/attractions.gateway';
import { TripsGateway } from 'src/app/gateways/trips-gateway.service';
import { MapperHelper } from 'src/app/helpers/mapper.helper';
import { CardModel } from 'src/app/models/cards/card';
import { ChipItem } from 'src/app/models/events/chip-item';
import { PagingModel } from 'src/app/models/paging/paging';
import { ImageUtility } from 'src/app/utilities/image.utility';

@Component({
  selector: 'app-choose-places',
  templateUrl: './choose-places.component.html',
  styleUrls: ['./choose-places.component.scss']
})
export class ChoosePlacesComponent implements OnInit {

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pagingOptions: PagingModel = {
    pageIndex: 1,
    pageSize: 5,
    totalPages: null,
    hasNextPage: false,
    length: null,
    isFirstPage: true
  }

  selectedSearchType: ItemType = 0;
  searchValue: string = null;
  selectedValue: any;
  data: any[];

  selectedItems: ChipItem[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly injectedData: any,
    private readonly matDialogRef: MatDialogRef<ChoosePlacesComponent>,
    private readonly router: Router,
    private readonly tripsGateway: TripsGateway,
    private readonly attractionsGateway: AttractionsGateway,
    private readonly mapper: MapperHelper) {
  }

  ngOnInit(): void {
    if(this.injectedData?.selectedItems) {
      this.selectedItems = this.injectedData.selectedItems;
    }

    if (!this.selectedItems) {
      this.selectedItems = [];
    }

    this.pagingOptions.pageIndex = 0,
      this.getData();
  }

  onConfirm(): void {
    this.matDialogRef.close(this.selectedItems);
  }

  onClear(): void {
    this.selectedItems = [];
  }

  search(): void {
    this.getData();
  }

  isInItemList(item: CardModel): boolean {
    let index = this.selectedItems.findIndex((e) => e.id === item.id && e.placeType === this.selectedSearchType)

    if (index !== -1) {
      return true;
    }

    return false;
  }

  onItemSelect(event: MatCheckboxChange, item: CardModel): void {

    if (event.checked) {
      this.selectedItems.push({
        id: item.id,
        name: item.title,
        placeType: this.selectedSearchType
      });
    }
    else {
      let index = this.selectedItems.findIndex((e) => e.id === item.id && e.placeType === this.selectedSearchType);

      if (this.isInItemList(item)) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  onPaginationOptionsChange(event: PageEvent) {
    this.pagingOptions.pageSize = event.pageSize;
    this.pagingOptions.pageIndex = event.pageIndex;

    this.getData();
  }

  getData() {
    if (this.selectedSearchType === ItemType.attraction) {
      this.attractionsGateway.getAttractions({
        pageSize: this.pagingOptions.pageSize,
        pageIndex: this.pagingOptions.pageIndex,
        searchValue: this.searchValue || ''
      })
        .subscribe(result => {
          this.pagingOptions.length = result.length;
          this.data = [];
          result.data.forEach(item => {
            let card = this.mapper.mapAttractionToCard(item)
            if (card.imagePath) {
              card.imagePath = ImageUtility.convertImagePathToUrl(card.imagePath);
            }
            this.data.push(card);
          });
        });
    }
    else {
      this.tripsGateway.getTrips({
        pageSize: this.pagingOptions.pageSize,
        pageIndex: this.pagingOptions.pageIndex,
        searchValue: this.searchValue ?? '',
      })
        .subscribe(result => {
          this.pagingOptions.length = result.length;
          this.data = [];
          result.data.forEach(item => {
            let card = this.mapper.mapTripToCard(item)
            if (card.imagePath) {
              card.imagePath = ImageUtility.convertImagePathToUrl(card.imagePath);
            }
            this.data.push(card);
          });
        });
    }
  }

  onCardClick(card: CardModel) {
    let link = 'trip/' + card.id;

    if (this.selectedSearchType === ItemType.attraction) {
      link = 'attractions/' + card.id;
    }

    this.router.navigate([])
      .then(() => { window.open(link), '_blank' });
  }

  onSelectChange(searchType) {
    this.selectedSearchType = searchType;
    this.pagingOptions.pageSize = 5;
    this.pagingOptions.pageIndex = 0

    this.getData();
  }
}
