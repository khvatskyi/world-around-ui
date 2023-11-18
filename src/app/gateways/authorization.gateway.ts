import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from 'src/app/models/authorization/login';
import { RegistrationModel } from 'src/app/models/authorization/registration';
import { AuthenticationResultModel } from 'src/app/models/authorization/authentication-result';
import { Observable } from 'rxjs';
import { UriUtility } from 'src/app/utilities/uri.utility';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGateway {

  baseUrl = UriUtility.createUri(environment.apiBaseUrl, 'Authentication');

  constructor(private readonly http: HttpClient) { }

  authorize(login: LoginModel): Observable<AuthenticationResultModel> {

    const path = 'Authorize';

    return this.http.post<AuthenticationResultModel>(UriUtility.createUri(this.baseUrl, path), login)
  }

  createUser(user: RegistrationModel) {

    const path = 'Create';

    return this.http.post(UriUtility.createUri(this.baseUrl, path), user);
  }
}
