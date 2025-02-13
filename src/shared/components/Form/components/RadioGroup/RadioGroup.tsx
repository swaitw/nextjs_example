"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { BaseFormFieldProps, FieldHandler, FormFieldValues } from "../../types";
import styles from "./RadioGroup.module.scss";

export type RadioGroupProps = Omit<BaseFormFieldProps<string>, "type"> & {
  options: { label: string; value: string }[];
  defaultValue?: string;
};

const RadioGroup: FC<RadioGroupProps> = ({
  options,
  name,
  defaultValue,
  onChange,
  register,
}) => {
  const handler = useRef<FieldHandler<FormFieldValues | null>>({
    value: () => currentSelectedValue.current,
    focus: () => {},
    blur: () => {},
    set: (value: FormFieldValues) => setSelectedValue(value as string),
    reset: () => setSelectedValue(defaultValue),
  });
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const currentSelectedValue = useRef(defaultValue);
  const { unregister } = register?.(name, handler, { validators: [] }) || {};
  useEffect(() => {
    return () => {
      unregister?.();
    };
  }, []);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    currentSelectedValue.current = value;
    onChange?.(value);
  };

  return (
    <div className={styles["radio-group-options"]}>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name={name}
            checked={selectedValue === option.value}
            onChange={() => handleChange?.(option.value)}
            aria-label={option.label}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
