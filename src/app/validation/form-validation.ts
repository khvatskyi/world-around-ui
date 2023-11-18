import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export const identical = (firstControlName: string, secondControlName: string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {

    const firstControl = control.get(firstControlName);
    const secondControl = control.get(secondControlName);

    if (secondControl.touched && secondControl.value !== '' && firstControl.value !== secondControl.value) {
      secondControl.setErrors({ identical: true });
    } else if (secondControl.hasError('identical')) {
      secondControl.setErrors(null);
    }

    return null;
  }
