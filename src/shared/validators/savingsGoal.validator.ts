export const VALUE_MAX = 1000000;
const ERROR_MESSAGE = "Savings goal must be less than $1,000,000";
const savingsGoalValidator = (value: number) => {
  if (value > VALUE_MAX) {
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

export default savingsGoalValidator;
