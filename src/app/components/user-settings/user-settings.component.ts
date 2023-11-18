import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersGateway } from 'src/app/gateways/users.gateway';
import { ImageUtility } from 'src/app/utilities/image.utility';
import { UpdateUserModel } from 'src/app/models/users/update-user';
import { IValidationModel } from 'src/app/models/validation/interfaces/IValidationModel';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ConfirmPasswordAbstractControlValidation, EmailAbstractControlValidation, PasswordAbstractControlValidation, UniqueLoginValidator, UsernameAbstractControlValidation } from 'src/app/validation/authentication-control-validation';
import { identical } from 'src/app/validation/form-validation';
import { CurrentPasswordValidator } from 'src/app/validation/user-validation';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  imageUrl: string | ArrayBuffer;
  pending: boolean = true;
  model: UpdateUserModel;
  formGroup: FormGroup;
  validation: {
    email: IValidationModel,
    userName: IValidationModel,
    currentPassword: IValidationModel,
    newPassword: IValidationModel,
    confirmPassword: IValidationModel
  }

  constructor(
    private readonly toastr: ToastrService,
    private readonly formBuilder: FormBuilder,
    private readonly passwordValidator: CurrentPasswordValidator,
    private readonly loginValidator: UniqueLoginValidator,
    private readonly usersGateway: UsersGateway,
    private readonly authService: AuthorizationService) {
  }

  ngOnInit(): void {
    this.model = new UpdateUserModel();
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    this.formGroup = this.formBuilder.group({
      'firstName': [this.model.firstName],
      'lastName': [this.model.lastName],
      'email': [this.model.email, {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.loginValidator.validate],
        updateOn: 'blur'
      }],
      'userName': [this.model.userName, {
        validators: [Validators.required],
        asyncValidators: [this.loginValidator.validate],
        updateOn: 'blur'
      }],
      'passwordsGroup': this.formBuilder.group({
        'currentPassword': [null, {
          validators: [Validators.required],
          asyncValidators: [this.passwordValidator.validate],
          updateOn: 'blur'
        }],
        'newPassword': [null, Validators.required],
        'confirmPassword': [null, Validators.required]
      }, { validators: identical('newPassword', 'confirmPassword') })
    });

    this.validation = {
      email: new EmailAbstractControlValidation(this.formGroup.get('email')),
      userName: new UsernameAbstractControlValidation(this.formGroup.get('userName')),
      currentPassword: new PasswordAbstractControlValidation(this.formGroup.get('passwordsGroup').get('currentPassword')),
      newPassword: new PasswordAbstractControlValidation(this.formGroup.get('passwordsGroup').get('newPassword')),
      confirmPassword: new ConfirmPasswordAbstractControlValidation(this.formGroup.get('passwordsGroup').get('confirmPassword')),
    };

    this.usersGateway.getById(this.authService.getUserId())
      .subscribe(result => {
        this.model = <UpdateUserModel><unknown>result;
        this.imageUrl = ImageUtility.convertImagePathToUrl(result.imagePath);
        Object.keys(this.model).forEach(key => {
          if (key !== 'id' && key !== 'imagePath') {
            this.formGroup.get(key).reset(this.model[key]);
          }
        });
        this.pending = false;
      });
  }

  updatePassword(): void {

    let group = this.formGroup.get('passwordsGroup');
    let currentPasswordControl = group.get('currentPassword');
    let confirmPasswordControl = group.get('confirmPassword');

    if (!currentPasswordControl.valid || !confirmPasswordControl.valid) {
      return;
    }

    this.usersGateway.updatePassword(this.authService.getUserId(), currentPasswordControl.value, confirmPasswordControl.value)
    .subscribe(() => {
      window.location.reload();
    })
  }

  onImageSelected(event: any) {
    if (!event.target.files[0] || event.target.files.length === 0) {
      return;
    }

    let image = <File>event.target.files[0];

    if (image.type.match(/image\/*/) === null) {
      return;
    }

    this.updateImage(image);

    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }

  updateImage(image: File) {

    let data = new FormData();
    data.append('image', image);
    this.usersGateway.updateImage(this.authService.getUserId(), data).subscribe();
  }

  updateField(controlName): void {

    let control = this.formGroup.get(controlName);

    if (!control.valid) {
      return;
    }

    let user = new UpdateUserModel;
    user.id = this.model.id;
    user[controlName] = control.value;

    this.usersGateway.update(user)
      .subscribe(result => {
        this.model[controlName] = result[controlName];
        this.reset(controlName);
      });
  }

  reset(controlName) {
    this.formGroup.get(controlName).reset(this.model[controlName]);
  }

  onSubmit() {
  }
}
