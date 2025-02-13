//TO DO: Should use Class to implement Services

import { ServiceResponse } from "./types";

const CREATE_ACCOUNT_SERVICE_URL = "/api/create-account";
const ERROR_MESSAGE = "Oops! Something went wrong. Please try again later.";

export interface ICreateAccountServiceBody {
  nickname: string;
  savingsGoal?: number;
  accountType: string;
}

export interface QueryOptions {
  signal?: AbortSignal;
}

export const createAccount = async (
  body: ICreateAccountServiceBody,
  options?: QueryOptions
) => {
  const signal = options?.signal;
  try {
    const result = await fetch(CREATE_ACCOUNT_SERVICE_URL, {
      signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = (await result.json()) as ServiceResponse<null>;

    return data;
  } catch (error) {
    console.error("Error creating account", error);
    if (signal?.aborted) {
      return {
        success: false,
        message: "Request was aborted",
        error: {
          message: "Request was aborted",
        },
      };
    }
    return {
      success: false,
      message: ERROR_MESSAGE,
      error: {
        message: ERROR_MESSAGE,
      },
    };
  }
};
