import React, { FC } from "react";
import TextInputField, { TextInputFieldProps } from "../TextInputField";

export type NumberInputFieldProps = TextInputFieldProps<number>;

const MoneyNumberInputField: FC<NumberInputFieldProps> = ({
  label,
  ...props
}) => {
  return <TextInputField {...props} label={label} type="money" />;
};

export default MoneyNumberInputField;
