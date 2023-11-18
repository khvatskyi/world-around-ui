import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { UsersGateway } from 'src/app/gateways/users.gateway';
import { ImageUtility } from 'src/app/utilities/image.utility';
import { ChipItem } from 'src/app/models/events/chip-item';
import { PagingModel } from 'src/app/models/paging/paging';
import { UserModel } from 'src/app/models/users/user';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-choose-people',
  templateUrl: './choose-people.component.html',
  styleUrls: ['./choose-people.component.scss']
})
export class ChoosePeopleComponent implements OnInit {

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pagingOptions: PagingModel = {
    pageIndex: 1,
    pageSize: 5,
    totalPages: null,
    hasNextPage: false,
    length: null,
    isFirstPage: true
  }

  searchValue: string = null;
  data: UserModel[];

  selectedItems: ChipItem[];

  constructor(
    private readonly authService: AuthorizationService,
    private readonly usersGateway: UsersGateway,
    @Inject(MAT_DIALOG_DATA) private readonly injectedData: any,
    private readonly matDialogRef: MatDialogRef<ChoosePeopleComponent>) {
  }

  ngOnInit(): void {
    if (this.injectedData?.selectedItems) {
      this.selectedItems = this.injectedData.selectedItems;
    }

    if (!this.selectedItems) {
      this.selectedItems = [];
    }

    this.pagingOptions.pageIndex = 0,
      this.getData();
  }

  getData() {
    this.usersGateway.get(
      this.searchValue,
      this.pagingOptions.pageIndex,
      this.pagingOptions.pageSize)
      .subscribe(result => {
        this.pagingOptions.length = result.pageInfo.length;
        this.data = [];
        let authorId = this.authService.getUserId();
        result.users.forEach(user => {
          if (user.id != authorId) {
            if (user.imagePath) {
              user.imagePath = ImageUtility.convertImagePathToUrl(user.imagePath);
            }
            this.data.push(user);
          }
        });
      });
  }

  search(): void {
    this.getData();
  }

  onPaginationOptionsChange(event: PageEvent) {
    this.pagingOptions.pageSize = event.pageSize;
    this.pagingOptions.pageIndex = event.pageIndex;

    this.getData();
  }

  onConfirm(): void {
    this.matDialogRef.close(this.selectedItems);
  }

  onClear(): void {
    this.selectedItems = [];
  }

  isInItemList(item: UserModel): boolean {
    let index = this.selectedItems.findIndex((e) => e.id === item.id);

    if (index !== -1) {
      return true;
    }

    return false;
  }

  onItemSelect(event: MatCheckboxChange, item: UserModel): void {

    if (event.checked) {
      this.selectedItems.push({
        id: item.id,
        name: item.userName,
        placeType: undefined
      });
    }
    else if (this.isInItemList(item)) {
      let index = this.selectedItems.findIndex((e) => e.id === item.id);
      this.selectedItems.splice(index, 1);
    }
  }
}
