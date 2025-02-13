import {
  EVERYDAY_ACCOUNT_TYPE,
  SAVINGS_ACCOUNT_TYPE,
} from "@/shared/constants/account.constant";
import { NextResponse } from "next/server";

const ERROR_MESSAGE_FOR_MISSING_FIELDS =
  "Please provide all required fields and try again";
const ERROR_MESSAGE_FOR_NICKNAME_LENGTH =
  "Nickname must be between 3 and 30 characters";
const ERROR_MESSAGE_FOR_INVALID_ACCOUNT_TYPE = "Invalid account type";
const ERROR_MESSAGE_FOR_MISSING_SAVINGS_GOAL = "Please provide a savings goal";
const ERROR_MESSAGE_FOR_NEGATIVE_SAVINGS_GOAL =
  "Savings goal must be a positive number";
const SUCCESS_MESSAGE = "Account created successfully";

export async function POST(req: Request) {
  const data = await req.json();

  const { nickname, savingsGoal, accountType } = data;
  if (!nickname || !accountType) {
    return NextResponse.json({
      success: false,
      message: ERROR_MESSAGE_FOR_MISSING_FIELDS,
      error: {
        message: ERROR_MESSAGE_FOR_MISSING_FIELDS,
      },
    });
  }

  if (nickname.length < 3 || nickname.length > 30) {
    return NextResponse.json({
      success: false,
      message: ERROR_MESSAGE_FOR_NICKNAME_LENGTH,
      error: {
        message: ERROR_MESSAGE_FOR_NICKNAME_LENGTH,
      },
    });
  }
  if (
    accountType !== SAVINGS_ACCOUNT_TYPE &&
    accountType !== EVERYDAY_ACCOUNT_TYPE
  ) {
    return NextResponse.json({
      success: false,
      message: ERROR_MESSAGE_FOR_INVALID_ACCOUNT_TYPE,
      error: {
        message: ERROR_MESSAGE_FOR_INVALID_ACCOUNT_TYPE,
      },
    });
  }
  if (accountType === SAVINGS_ACCOUNT_TYPE && !savingsGoal) {
    return NextResponse.json({
      success: false,
      message: ERROR_MESSAGE_FOR_MISSING_SAVINGS_GOAL,
      error: {
        message: ERROR_MESSAGE_FOR_MISSING_SAVINGS_GOAL,
      },
    });
  }

  if (savingsGoal < 0) {
    return NextResponse.json({
      success: false,
      message: ERROR_MESSAGE_FOR_NEGATIVE_SAVINGS_GOAL,
      error: {
        message: ERROR_MESSAGE_FOR_NEGATIVE_SAVINGS_GOAL,
      },
    });
  }

  return NextResponse.json({
    message: SUCCESS_MESSAGE,
    success: true,
    data: null,
    error: null,
  });
}
