import React, { FC, useEffect } from "react";
import Form from "@/shared/components/Form";
import useForm from "@/shared/components/Form/hooks/useForm.hook";
import { FormValidationStatusLayer } from "@/shared/components/Form/types";
import { ICreateAccountServiceBody } from "@/services/accounts.service";
import SelectAccountType from "./SelectAccountType";
import AccountNickname from "./AccountNickname";

interface CreateAccountFormProps {
  onCreate?: (data: ICreateAccountServiceBody) => Promise<boolean>;
}

const CreateAccountForm: FC<CreateAccountFormProps> = ({ onCreate }) => {
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);
  const validationStatusHandler = React.useRef<FormValidationStatusLayer>({
    toggleStatus: (isValid: boolean) => {
      submitButtonRef.current!.disabled = !isValid;
    },
  });

  const isMounted = React.useRef(false);
  const form = useForm();
  const { registerFormValidationStatusLayer } = form;
  registerFormValidationStatusLayer?.(validationStatusHandler);

  useEffect(() => {
    isMounted.current = true;
    submitButtonRef.current!.disabled = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleOnSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    submitButtonRef.current!.disabled = true;

    const results = await form.validateAll();
    if (!isMounted.current) {
      return;
    }
    const isValid = results.every((result) => result.isValid);
    validationStatusHandler.current?.toggleStatus(isValid);
    if (!isValid) {
      return;
    } else {
      const { accountType, nickname, savingsGoal } = form.values();
      const isSuccess = await onCreate?.({
        accountType: accountType as string,
        nickname: nickname as string,
        savingsGoal: savingsGoal as number,
      });
      if (isMounted.current) {
        submitButtonRef.current!.disabled = isSuccess === true;
      }
    }
  };

  return (
    <>
      <Form>
        <AccountNickname form={form} />
        <SelectAccountType form={form} />
        <button
          className="button-primary"
          ref={submitButtonRef}
          onClick={handleOnSubmit}
        >
          Create Account
        </button>
      </Form>
    </>
  );
};

export default CreateAccountForm;
