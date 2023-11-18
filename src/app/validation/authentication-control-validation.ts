import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of } from "rxjs";
import { UsersGateway } from "../gateways/users.gateway";
import { IValidationModel } from "../models/validation/interfaces/IValidationModel";

@Injectable({
  providedIn: 'root'
})
export class UniqueLoginValidator implements AsyncValidator {

  constructor(private readonly gateway: UsersGateway) {}

  validate = (control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> => {

    return this.gateway.exists(control.value).pipe(
      map(isTaken => (isTaken ? { unique: true } : null)),
      catchError(() => of(null))
    );
  }

  registerOnValidatorChange?(fn: () => void): void {
    throw new Error("Method not implemented.");
  }
}

export class AbstractControlValidation {

  get isValid(): boolean {
    return !(this.control.errors && (this.control.touched || this.control.dirty));
  }

  constructor(protected control: AbstractControl) { }
}

export class EmailAbstractControlValidation extends AbstractControlValidation implements IValidationModel {

  get message(): string | null {

    if (!this.isValid) {
      if (this.control.hasError('required')) {
        return 'Email is required';
      }
      if (this.control.hasError('email')) {
        return 'Please enter a valid email';
      }
      if (this.control.hasError('unique')) {
        return 'The email is already used';
      }
    }

    return null;
  }

  constructor(control: AbstractControl) {
    super(control);
  }
}

export class UsernameAbstractControlValidation extends AbstractControlValidation implements IValidationModel {

  get message(): string | null {

    if (!this.isValid) {
      if (this.control.hasError('required')) {
        return 'Username is required';
      }
      if (this.control.hasError('unique')) {
        return 'Username already exists';
      }
    }

    return null;
  }

  constructor(control: AbstractControl) {
    super(control)
  }
}

export class PasswordAbstractControlValidation extends AbstractControlValidation implements IValidationModel {

  get message(): string | null {

    if (!this.isValid) {
      if(this.control.hasError('required')) {
        return 'Password is required';
      }
      if(this.control.hasError('correct')) {
        return 'Password is not correct';
      }
    }

    return null;
  };

  constructor(control: AbstractControl) {
    super(control);
  }
}

export class ConfirmPasswordAbstractControlValidation extends AbstractControlValidation implements IValidationModel {

  get message(): string | null {

    if (!this.isValid) {
      if (this.control.hasError('required')) {
        return 'Confirmation is required';
      }
      if (this.control.hasError('identical')) {
        return 'Passwords are not the same';
      }
    }

    return null;
  }

  constructor(control: AbstractControl) {
    super(control);
  }
}

export class LoginAbstractControlValidation extends AbstractControlValidation implements IValidationModel {

  get message(): string | null {

    if (!this.isValid) {
      if (this.control.hasError('required')) {
        return 'Login is required';
      }
    }

    return null;
  }

  constructor(control: AbstractControl) {
    super(control);
  }
}
