import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegistrationModel } from 'src/app/models/authorization/registration';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { identical } from 'src/app/validation/form-validation';
import { ConfirmPasswordAbstractControlValidation, EmailAbstractControlValidation, PasswordAbstractControlValidation, UniqueLoginValidator, UsernameAbstractControlValidation } from 'src/app/validation/authentication-control-validation';
import { IValidationModel } from 'src/app/models/validation/interfaces/IValidationModel';
import { FormGroupHelper } from 'src/app/helpers/form-group.helper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../authentication.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  model: RegistrationModel;
  signUpForm: UntypedFormGroup;
  validation: {
    email: IValidationModel,
    userName: IValidationModel,
    password: IValidationModel,
    confirmPassword: IValidationModel
  }

  constructor(
    private readonly authService: AuthorizationService,
    private readonly toastr: ToastrService,
    private readonly dialogRef: MatDialogRef<SignupComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly loginValidator: UniqueLoginValidator) {
  }

  ngOnInit(): void {

    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    this.model = new RegistrationModel();
    this.signUpForm = this.formBuilder.group({
      'email': [null, {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.loginValidator.validate.bind(this.loginValidator)],
        updateOn: 'blur'
      }],
      'userName': [null, {
        validators: [Validators.required],
        asyncValidators: [this.loginValidator.validate.bind(this.loginValidator)],
        updateOn: 'blur'
      }],
      'password': [null, Validators.required],
      'confirmPassword': [null, Validators.required],
    }, { validators: identical('password', 'confirmPassword') });

    this.validation = {
      email: new EmailAbstractControlValidation(this.signUpForm.get('email')),
      userName: new UsernameAbstractControlValidation(this.signUpForm.get('userName')),
      password: new PasswordAbstractControlValidation(this.signUpForm.get('password')),
      confirmPassword: new ConfirmPasswordAbstractControlValidation(this.signUpForm.get('confirmPassword')),
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.toastr.toastrConfig.positionClass = 'toast-top-right';
  }

  openLogin(): void {
    this.dialogRef.close(true);
  }

  onSubmit(): void {

    if (!this.signUpForm.valid) {
      return;
    }

    FormGroupHelper.mapToModel(this.model, this.signUpForm);
    this.authService.signUp(this.model)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.toastr.success('Successful!');
          this.openLogin();
        },
        error: (response) => {
          Object.keys(response).forEach(key => {
            response[key].forEach((message: string) => {
              this.toastr.error(message);
            })
          })
        }
      });
  }
}
