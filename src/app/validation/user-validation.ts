import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of } from "rxjs";
import { UsersGateway } from "../gateways/users.gateway";
import { AuthorizationService } from "../services/authorization.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentPasswordValidator implements AsyncValidator {

  constructor(
    private readonly gateway: UsersGateway,
    private readonly authService: AuthorizationService) {
  }

  validate = (control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> => {

    var userId = this.authService.getUserId();

    return this.gateway.checkPassword(userId, control.value).pipe(
      map(isCorrect => (!isCorrect ? { correct: true } : null)),
      catchError(() => of(null))
    );
  }
}
