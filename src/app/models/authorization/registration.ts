export class RegistrationModel {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class RegistrationModelValidationErrors {
  userName: string[];
  email: string[];
  password: string[];
}
