import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { LoginModel } from 'src/app/models/authorization/login';
import { RegistrationModel, RegistrationModelValidationErrors } from 'src/app/models/authorization/registration';
import { Observable, throwError } from 'rxjs';
import { AuthorizationGateway } from '../gateways/authorization.gateway';
import { AuthenticationResultDetails } from 'src/app/models/authorization/authentication-result-details';

const TOKEN = 'TOKEN';
const BAD_REQUEST_STATUS = 400;
const httpOptions = {
 headers: new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private readonly cookie: CookieService,
    private readonly jwtHelper: JwtHelperService,
    private readonly authGateway: AuthorizationGateway) { }

  signIn(login: LoginModel): Observable<AuthenticationResultDetails> {

    var result = this.authGateway.authorize(login)
      .pipe(
        map((response) => {

          let details = response.details;

          if (details.succeeded) {
            this.setToken(response.token);
          }

          return details;
        })
      );

    return result;
  }

  getUserName(): string {

    let token = this.cookie.get(TOKEN)

    return this.jwtHelper.decodeToken(token).unique_name;
  }

  getUserId(): number {

    let token = this.cookie.get(TOKEN)

    return this.jwtHelper.decodeToken(token).id;
  }

  signUp(user: RegistrationModel) {

    return this.authGateway.createUser(user)
      .pipe(catchError(this.handleError));
  }

  logout() {
    this.cookie.remove(TOKEN);
  }

  isAuthorized(): boolean {

    const token = this.cookie.get(TOKEN);

    if (token == null) {
      return false;
    }

    return !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    return this.cookie.get(TOKEN);
  }

  private handleError(errorResponse: HttpErrorResponse) {

    if (errorResponse.status === BAD_REQUEST_STATUS) {
      let modelErrors: RegistrationModelValidationErrors = errorResponse.error.errors;

      return throwError(() => modelErrors);
    }

    return throwError(() => new Error('Something bad happened. Please try again later.'));
  }

  private setToken(token: string): void {
    this.cookie.put(TOKEN, token);
  }

  private setAuthorizationHeader(): HttpHeaders {
    return httpOptions.headers.set('Authorization', 'Bearer' + this.getToken());
  }
}
