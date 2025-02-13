import { ValidationResult } from "./types";

const ERROR_MESSAGE =
  "Account nickname must be between 5 and 30 characters long and can only contain letters, numbers, underscores, and hyphens.";
const VALIDATE_REGEX = /^[a-zA-Z0-9_-]{5,30}$/;
const accountNicknameValidator = (nickname: string): ValidationResult => {
  const regex = VALIDATE_REGEX;
  if (!regex.test(nickname)) {
    return {
      errorMessage: ERROR_MESSAGE,
      isValid: false,
    };
  }
  return {
    isValid: true,
    errorMessage: null,
  };
};

export default accountNicknameValidator;
