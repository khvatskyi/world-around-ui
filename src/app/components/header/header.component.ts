import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { LoginComponent } from '../authentication/login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  userName: string;
  selectedValue: any = 0;
  inputValue: any = '';

  constructor(
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly authService: AuthorizationService,
    private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {

  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  search(): void {

    if(!this.inputValue){
      this.toastr.error('Search field should not be empty!', 'Error');
      return;
    }

    this.router.navigate([`/search/${this.selectedValue}/${this.inputValue}`]);
  }

  authorized(): boolean {

    if(!this.authService.isAuthorized()) {
      this.userName = undefined;
      return false;
    }

    if (!this.userName) {
      this.userName = this.authService.getUserName();
    }

    return true;
  }

  openLogin(): void {

    this.dialog.open(LoginComponent, {
      panelClass: 'authentication-modal'
    });
  }
}
