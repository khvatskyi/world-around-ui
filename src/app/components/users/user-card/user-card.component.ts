import { Component, Input, OnInit } from '@angular/core';
import { ImageUtility } from 'src/app/utilities/image.utility';
import { UserModel } from 'src/app/models/users/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  imageUrl: string;
  @Input() user: UserModel;

  constructor() { }

  ngOnInit(): void {
    this.imageUrl = `url(${this.user.imagePath ?? ImageUtility.noUserImage})`;
  }

  get fullName(): string {

    let fullName = this.user.firstName ?? '';
    fullName += ' ' + (this.user.lastName ?? '');
    fullName = fullName.trim();

    return fullName;
  }
}
