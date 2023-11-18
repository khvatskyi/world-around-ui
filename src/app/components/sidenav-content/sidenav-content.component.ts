import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-sidenav-content',
  templateUrl: './sidenav-content.component.html',
  styleUrls: ['./sidenav-content.component.scss']
})
export class SidenavContentComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();

  constructor(private readonly authService: AuthorizationService) { }

  ngOnInit(): void {
  }

  logout(): void {

    this.authService.logout();
    this.onSideNavClose();
  }

  onSideNavClose(): void {
    this.sidenavClose.emit();
  }
}
