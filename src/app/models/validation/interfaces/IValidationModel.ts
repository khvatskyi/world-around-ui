export interface IValidationModel {
  get isValid(): boolean;
  get message(): string | null;
}
