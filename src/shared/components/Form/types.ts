import { ValidationResult } from "@/shared/validators/types";

export type Validator<T> = (value: T) => ValidationResult;

export interface ValidatedStatus extends ValidationResult {
  validated: boolean;
}
export interface FieldHandler<T> {
  value: () => T;
  focus: () => void;
  blur: () => void;
  set: (value: T) => void;
  reset: () => void;
}

export interface ErrorLayerHandler {
  setError: (message: string) => void;
  clearError: () => void;
}

export interface FormValidationStatusLayer {
  toggleStatus: (isValid: boolean) => void;
}

export interface RegisterFieldOptions {
  needValidation?: boolean;
  validators?: Validator<FormFieldValues>[];
}

export type FormFieldUnregisterHandler = () => void;

export type FormFieldRegisterHandler = (
  name: string,
  ref: React.RefObject<FieldHandler<FormFieldValues> | null>,
  option?: RegisterFieldOptions
) => {
  unregister: FormFieldUnregisterHandler;
};
export type validateHandler = (name: string) => Promise<ValidationResult>;
export type FormFieldValues =
  | string
  | number
  | boolean
  | object
  | null
  | undefined;
export interface BaseFormFieldProps<
  T extends FormFieldValues = FormFieldValues
> {
  name: string;
  required?: boolean;
  className?: string;
  id?: string;
  defaultValue?: T;
  label?: string;
  placeholder?: string;
  validators?: Validator<T>[];
  onChange?: (value: T) => void;
  onBlur?: (value: T) => void;
  register?: FormFieldRegisterHandler;
  validate?: validateHandler;
}
