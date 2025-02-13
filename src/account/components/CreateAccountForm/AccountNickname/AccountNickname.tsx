import React, { FC } from "react";
import FieldError from "@/shared/components/Form/components/FieldError";
import FormFieldWrapper from "@/shared/components/Form/components/FormFieldWrapper";
import TextInputField from "@/shared/components/Form/components/TextInputField";
import { FormHandlers } from "@/shared/components/Form/hooks/useForm.hook";
import { accountNicknameValidator } from "@/shared/validators";

const FIELD_NAME = "nickname";
const FIELD_LABEL = "Account Nickname";

interface AccountNicknameProps {
  form: FormHandlers;
}

const AccountNickname: FC<AccountNicknameProps> = ({ form }) => {
  const { register, validate } = form;
  return (
    <FormFieldWrapper>
      <label htmlFor={FIELD_NAME}>{FIELD_LABEL}:</label>
      <TextInputField
        name={FIELD_NAME}
        validators={[accountNicknameValidator]}
        register={register}
        validate={validate}
        label={FIELD_LABEL}
      />
      <FieldError form={form} htmlFor={FIELD_NAME} />
    </FormFieldWrapper>
  );
};

export default AccountNickname;
