import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModel } from 'src/app/models/authorization/login';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IValidationModel } from 'src/app/models/validation/interfaces/IValidationModel';
import { LoginAbstractControlValidation } from 'src/app/validation/authentication-control-validation';
import { FormGroupHelper } from 'src/app/helpers/form-group.helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../authentication.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private returnUrl;

  loginForm: FormGroup;
  loginModel: LoginModel = new LoginModel();
  loginBtnDisabled: boolean = false;
  validation: {
    login: IValidationModel,
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthorizationService,
    private readonly toastr: ToastrService,
    private readonly dialogRef: MatDialogRef<LoginComponent>,
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';

    this.loginForm = this.formBuilder.group({
      'login': [null, [Validators.required]],
      'password': [null]
    });

    this.validation = {
      login: new LoginAbstractControlValidation(this.loginForm.get('login'))
    };

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy(): void {

    this.toastr.toastrConfig.positionClass = 'toast-top-right';
  }

  openSignUp(): void {

    this.dialogRef.afterClosed()
      .subscribe(() => {
        this.dialog.open(SignupComponent, {
          panelClass: 'authentication-modal'
        });
      })
    this.dialogRef.close();
  }

  onSubmit(): void {

    if (!this.loginForm.valid) {
      return;
    }

    FormGroupHelper.mapToModel(this.loginModel, this.loginForm);
    this.loginBtnDisabled = true;
    this.authService.signIn(this.loginModel)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
          this.toastr.success('Authentication passed');
          this.dialogRef.close();
        },
        error: () => {
          this.toastr.error('Wrong credentials!');
        },
      })
      .add(() => {
        this.loginBtnDisabled = false;
      });
  }
}
