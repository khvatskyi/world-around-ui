import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersGateway } from 'src/app/gateways/users.gateway';
import { UserModel } from 'src/app/models/users/user';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss']
})
export class UsersGridComponent implements OnInit {

  @Input() width: string = "880px";
  @Input() height: string = "auto";
  @Input() userId: number;
  @Input() searchValue: string;
  @Input() autoLoad: boolean = true;

  @Output() dataLoaded: EventEmitter<number> = new EventEmitter<number>();

  users: UserModel[] = [];
  length: number = 0;

  // params: GetAttractionsParams = {
  //   pageSize: 5,
  //   pageIndex: 0
  // };

  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private readonly usersGateway: UsersGateway) { }

  ngOnInit(): void {

    if (this.autoLoad) {
      this.updateInfo();
    }
  }

  ngOnChanges(): void {
    this.updateInfo();
  }

  updatePage(event: any): void {

    // this.params.pageIndex = event.pageIndex;
    // this.params.pageSize = event.pageSize;

    this.getUsers();
  }

  getUsers(): void {

    // this.attractionsGateway.getAttractions(this.params).subscribe(data => {
    //   this.attractions = data.data;
    //   this.length = data.length;
    //   this.dataLoaded.emit(data.length);
    // });
  }

  private updateInfo(): void {

    // if (this.userId) {
    //   this.params.userId = this.userId;
    // }

    // if (this.searchValue) {
    //   this.params.searchValue = this.searchValue;
    // }

    this.getUsers();
  }
}
