import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-my-attractions',
  templateUrl: './my-attractions.component.html',
  styleUrls: ['./my-attractions.component.scss']
})
export class MyAttractionsComponent implements OnInit {

  userId: number;

  constructor(private readonly authService: AuthorizationService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

}
