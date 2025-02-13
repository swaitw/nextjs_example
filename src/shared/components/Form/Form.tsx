import React, { FC, PropsWithChildren } from "react";

interface FormProps {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  method?: "get" | "post";
  action?: string;
}

const Form: FC<PropsWithChildren<FormProps>> = ({
  children,
  onSubmit,
  method,
  action,
}) => {
  return (
    <form onSubmit={onSubmit} method={method} action={action}>
      {children}
    </form>
  );
};

export default Form;
