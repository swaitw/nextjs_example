"use client";
import React, { useEffect, useRef } from "react";
import {
  BaseFormFieldProps,
  FieldHandler,
  FormFieldValues,
  Validator,
} from "../../types";

type TextInputType = "text" | "password" | "email" | "number" | "money";
export type ValueTypes = string | number;

export type TextInputFieldProps<T extends ValueTypes> = Omit<
  BaseFormFieldProps<T>,
  "type"
> & {
  type?: TextInputType;
  step?: number;
  min?: number;
  max?: number;
};

const moneyFormatter = (value: string) => {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const convertToNumber = (value?: string | null) => {
  if (!value) return 0;
  return Number(value.replace(/\D/g, ""));
};

const parseInputValue = (type: TextInputType, value?: string | null) => {
  switch (type) {
    case "money":
      return convertToNumber(value);
    default:
      return value;
  }
};

const TextInputField = <T extends ValueTypes>({
  onChange,
  onBlur,
  validators = [],
  type = "text",
  register,
  validate,
  name,
  label,
  ...props
}: TextInputFieldProps<T>) => {
  const ref = useRef<FieldHandler<ValueTypes>>({
    value: () => parseInputValue(type, inputRef.current?.value) as ValueTypes,
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    set: (value: ValueTypes) => {
      inputRef.current!.value = value as unknown as string;
    },
    reset: () => {
      inputRef.current!.value = "";
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (register && name) {
      const { unregister } =
        register(
          name,
          ref as unknown as React.RefObject<FieldHandler<FormFieldValues>>,
          {
            validators: validators as unknown as Validator<FormFieldValues>[],
          }
        ) ?? {};
      return () => {
        unregister?.();
      };
    }
  }, [register, name, validators]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(parseInputValue(type, e.target.value) as T);
    if (type === "money") {
      e.target.value = moneyFormatter(e.target.value);
    }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInputValue(type, e.target.value) as T;
    validate?.(name);
    onBlur?.(value);
  };

  return (
    <input
      {...props}
      name={name}
      onChange={handleChange}
      onBlur={handleBlur}
      ref={inputRef}
      aria-label={label}
    />
  );
};

export default TextInputField;
