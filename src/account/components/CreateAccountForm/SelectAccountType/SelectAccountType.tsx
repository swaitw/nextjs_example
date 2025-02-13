import React, { FC } from "react";
import FieldError from "@/shared/components/Form/components/FieldError";
import FormFieldWrapper from "@/shared/components/Form/components/FormFieldWrapper";
import MoneyNumberInputField from "@/shared/components/Form/components/MoneyNumberInputField";
import RadioGroup from "@/shared/components/Form/components/RadioGroup";
import { FormHandlers } from "@/shared/components/Form/hooks/useForm.hook";
import {
  EVERYDAY_ACCOUNT_TYPE,
  SAVINGS_ACCOUNT_TYPE,
} from "@/shared/constants/account.constant";
import { savingsGoalValidator, VALUE_MAX } from "@/shared/validators";

const FIELD_NAME = "accountType";
const FIELD_LABEL = "Account Type";
const EVERYDAY_ACCOUNT_LABEL = "Everyday account";
const SAVINGS_ACCOUNT_LABEL = "Savings account";
const DEFAULT_ACCOUNT_TYPE = EVERYDAY_ACCOUNT_TYPE;
const SAVINGS_GOAL_NAME = "savingsGoal";
const SAVINGS_GOAL_LABEL = "Savings Goal";

const VALUE_STEP = 100;

const options = [
  { label: EVERYDAY_ACCOUNT_LABEL, value: EVERYDAY_ACCOUNT_TYPE },
  { label: SAVINGS_ACCOUNT_LABEL, value: SAVINGS_ACCOUNT_TYPE },
];

interface SelectAccountTypeProps {
  form: FormHandlers;
}

const MemoizedRadioGroup = React.memo(RadioGroup);
const MemoizedFieldError = React.memo(FieldError);

const SelectAccountType: FC<SelectAccountTypeProps> = ({ form }) => {
  const [accountType, setAccountType] = React.useState(DEFAULT_ACCOUNT_TYPE);
  const { register, validate } = form;

  return (
    <div>
      <FormFieldWrapper>
        <label htmlFor={FIELD_NAME}>{FIELD_LABEL}:</label>
        <MemoizedRadioGroup
          name={FIELD_NAME}
          options={options}
          onChange={(value) => {
            setAccountType(value);
          }}
          register={register}
          defaultValue={DEFAULT_ACCOUNT_TYPE}
        />
        <MemoizedFieldError form={form} htmlFor={FIELD_NAME} />
      </FormFieldWrapper>
      {accountType === SAVINGS_ACCOUNT_TYPE ? (
        <FormFieldWrapper>
          <label>{SAVINGS_GOAL_LABEL} :</label>
          <MoneyNumberInputField
            name={SAVINGS_GOAL_NAME}
            step={VALUE_STEP}
            max={VALUE_MAX}
            validators={[savingsGoalValidator]}
            register={register}
            label={SAVINGS_GOAL_LABEL}
            validate={validate}
          />
          <FieldError form={form} htmlFor={SAVINGS_GOAL_NAME} />
        </FormFieldWrapper>
      ) : null}
    </div>
  );
};

export default React.memo(SelectAccountType);
