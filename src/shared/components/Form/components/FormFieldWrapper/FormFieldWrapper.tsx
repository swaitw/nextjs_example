import React, { FC, PropsWithChildren } from "react";

const FormFieldWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="form-field">{children}</div>;
};

export default FormFieldWrapper;
