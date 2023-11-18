import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegistrationModel } from 'src/app/models/authorization/registration';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  model: RegistrationModel;
  signUpForm: FormGroup;
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
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
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
    this.toastr.toastrConfig.positionClass = 'toast-top-right';
  }

  openLogin(): void {

    this.dialogRef.afterClosed()
      .subscribe(() => {
        this.dialog.open(LoginComponent, {
          panelClass: 'authentication-modal'
        });
      })
    this.dialogRef.close();
  }

  onSubmit(): void {

    if (!this.signUpForm.valid) {
      return;
    }

    FormGroupHelper.mapToModel(this.model, this.signUpForm);
    this.authService.signUp(this.model)
      .subscribe({
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
