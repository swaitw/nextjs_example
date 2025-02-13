import { useCallback, useRef } from "react";
import { ValidationResult } from "@/shared/validators/types";
import {
  ErrorLayerHandler,
  FieldHandler,
  FormFieldRegisterHandler,
  FormFieldValues,
  FormValidationStatusLayer,
  RegisterFieldOptions,
  Validator,
} from "../types";

interface FormField {
  name: string;
  ref: React.RefObject<FieldHandler<FormFieldValues> | null>;
  error?: string;
  validated: boolean;
  isValid: boolean;
  needValidation: boolean;
  validators: Validator<FormFieldValues>[];
}

interface FormFieldErrorLayer {
  errorLayer: React.RefObject<ErrorLayerHandler | null>;
}

const VALIDATED_SUCCESS = {
  errorMessage: "",
  isValid: true,
  validated: true,
};

export interface FormHandlers {
  register: FormFieldRegisterHandler;
  registerErrorLayer: (
    name: string,
    ref: React.RefObject<ErrorLayerHandler | null>
  ) => {
    unregister: () => void;
  };
  validate: (
    name: string,
    shouldUpdateCurrentValidationStatus?: boolean
  ) => Promise<ValidationResult>;
  validateAll: () => Promise<ValidationResult[]>;
  registerFormValidationStatusLayer: (
    ref: React.RefObject<FormValidationStatusLayer | null>
  ) => {
    unregister: () => void;
  };
  updateCurrentValidationStatus: (isValid: boolean) => void;
  values: () => { [key: string]: FormFieldValues };

  getValue: <T extends FormFieldValues>(name: string) => T;
}

export const validateFieldValue = async (
  value: FormFieldValues,
  validators: Validator<FormFieldValues>[] = []
): Promise<ValidationResult & { validated: boolean }> => {
  for (const validator of validators) {
    const result = await validator(value);

    if (!result.isValid) {
      return { ...result, validated: true };
    }
  }
  return { errorMessage: null, isValid: true, validated: true };
};

const useForm = (): FormHandlers => {
  const fields = useRef<{ [key: string]: FormField }>({});
  const errorLayers = useRef<{ [key: string]: FormFieldErrorLayer }>({});
  const formValidationStatusLayer = useRef<
    React.RefObject<FormValidationStatusLayer | null>[]
  >([]);

  const currentValidationStatus = useRef<boolean>(false);

  const register = useCallback(
    (
      name: string,
      ref: React.RefObject<FieldHandler<FormFieldValues> | null>,
      options: RegisterFieldOptions = {}
    ) => {
      const { needValidation = false, validators = [] } = options;

      fields.current[name] = {
        name,
        ref,
        needValidation: needValidation || validators.length > 0,
        error: "",
        validated: false,
        isValid: true,
        validators,
      };

      return {
        unregister: () => {
          delete fields.current[name];
        },
      };
    },
    []
  );

  const registerErrorLayer = useCallback(
    (name: string, ref: React.RefObject<ErrorLayerHandler | null>) => {
      if (!errorLayers.current[name]) {
        errorLayers.current[name] = {
          errorLayer: ref,
        };
      }
      return {
        unregister: () => {
          delete errorLayers.current[name];
        },
      };
    },
    []
  );

  const registerFormValidationStatusLayer = useCallback(
    (ref: React.RefObject<FormValidationStatusLayer | null>) => {
      if (!formValidationStatusLayer.current.includes(ref)) {
        formValidationStatusLayer.current.push(ref);
      }
      return {
        unregister: () => {
          formValidationStatusLayer.current =
            formValidationStatusLayer.current.filter((layer) => layer !== ref);
        },
      };
    },
    []
  );

  const updateCurrentValidationStatus = useCallback((isValid: boolean) => {
    if (currentValidationStatus.current === isValid) return;
    currentValidationStatus.current = isValid;
    formValidationStatusLayer.current.forEach((layer) => {
      layer.current?.toggleStatus(isValid);
    });
  }, []);

  const setError = useCallback((name: string, error: string) => {
    const field = fields.current[name];
    if (!field) return;
    field.error = error;
    field.isValid = false;
    field.validated = true;
    const errorLayer = errorLayers.current[name];
    if (errorLayer) {
      errorLayer.errorLayer.current?.setError(error);
    }
  }, []);

  const clearError = useCallback((name: string) => {
    const field = fields.current[name];
    if (!field) return;
    field.error = "";
    field.isValid = true;
    field.validated = true;
    const errorLayer = errorLayers.current[name];
    if (errorLayer) {
      errorLayer.errorLayer.current?.clearError();
    }
  }, []);

  const validate = useCallback(
    async (
      name: string,
      shouldUpdateCurrentValidationStatus: boolean = true
    ) => {
      const field = fields.current[name];
      if (!field) throw new Error(`Field with name ${name} is not registered`);

      if (!field.needValidation || field.validators.length === 0) {
        return VALIDATED_SUCCESS;
      }
      const value = field.ref.current?.value();
      const result =
        (await validateFieldValue(value, field.validators)) ||
        VALIDATED_SUCCESS;
      if (result.errorMessage) {
        setError(name, result.errorMessage);
      } else {
        clearError(name);
      }
      if (shouldUpdateCurrentValidationStatus) {
        updateCurrentValidationStatus(result.isValid);
      }

      return result;
    },
    [setError, clearError, updateCurrentValidationStatus]
  );

  const validateAll = useCallback(async () => {
    const result = await Promise.all(
      Object.keys(fields.current).map((name) => validate(name, false))
    );
    const isValid = result.every((field) => field.isValid);
    updateCurrentValidationStatus(isValid);
    return result;
  }, [validate, updateCurrentValidationStatus]);

  const values = useCallback(() => {
    return Object.keys(fields.current).reduce((acc, key) => {
      const field = fields.current[key];
      const value = field.ref.current?.value();
      return {
        ...acc,
        [key]: value,
      };
    }, {});
  }, []);

  const getValue = useCallback(
    <T extends FormFieldValues | undefined>(name: string) => {
      const field = fields.current[name];
      if (!field) throw new Error(`Field with name ${name} is not registered`);
      return field.ref.current?.value() as T;
    },
    []
  );

  return {
    register,
    registerErrorLayer,
    validate,
    validateAll,
    registerFormValidationStatusLayer,
    updateCurrentValidationStatus,
    values,
    getValue,
  };
};

export default useForm;
