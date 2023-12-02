import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, concatMap, filter, takeUntil } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { LoginComponent } from '../authentication/login/login.component';
import { SignupComponent } from '../authentication/signup/signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  search(): void {

    if (!this.inputValue) {
      this.toastr.error('Search field should not be empty!', 'Error');
      return;
    }

    this.router.navigate([`/search/${this.selectedValue}/${this.inputValue}`]);
  }

  authorized(): boolean {

    if (!this.authService.isAuthorized()) {
      this.userName = undefined;
      return false;
    }

    if (!this.userName) {
      this.userName = this.authService.getUserName();
    }

    return true;
  }

  openLogin(): void {

    this.dialog
      .open(LoginComponent, {
        panelClass: 'authentication-modal'
      })
      .afterClosed()
      .pipe(
        filter(openSignUp => !!openSignUp),
        concatMap(() => this.dialog.open(SignupComponent, {
          panelClass: 'authentication-modal'
        }).afterClosed()),
        filter(openSignUp => !!openSignUp),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.openLogin();
      });
  }
}
