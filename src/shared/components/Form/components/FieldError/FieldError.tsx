import React, { FC, useEffect, useRef, useState } from "react";
import { FormHandlers } from "../../hooks/useForm.hook";
import { ErrorLayerHandler } from "../../types";

interface FieldErrorProps {
  form: FormHandlers;
  htmlFor: string;
}

const FieldError: FC<FieldErrorProps> = ({
  form: { registerErrorLayer } = {},
  htmlFor,
}) => {
  const ref = useRef<ErrorLayerHandler>({
    setError: (error: string) => {
      setMessage(error);
    },
    clearError: () => setMessage(""),
  });

  const { unregister } = registerErrorLayer?.(htmlFor, ref) || {};

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    return () => {
      unregister?.();
    };
  }, []);

  if (!message) {
    return null;
  }

  return <div className="field-error">{message}</div>;
};

export default FieldError;
