import { UntypedFormGroup } from "@angular/forms";

export class FormGroupHelper {

  static mapToModel(model: any, group: UntypedFormGroup): void {

    Object.keys(group.controls).forEach((key) => {
      model[key] = group.get(key).value;
    });

    return model;
  }
}
