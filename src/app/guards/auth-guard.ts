import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginComponent } from '../components/authentication/login/login.component';
import { AuthorizationService } from '../services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationService,
    private readonly dialog: MatDialog,
    private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.authorizationService.isAuthorized()) {
      return true;
    }

    this.router.navigate([], { queryParams: { returnUrl: state.url } });
    this.dialog.open(LoginComponent, {
      panelClass: 'authentication-modal'
    });

    return false;
  }
}
