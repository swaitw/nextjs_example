import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateAccountForm from "./CreateAccountForm";

describe("CreateAccountForm", () => {
  it("renders the form correctly", () => {
    render(<CreateAccountForm />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  it("disables submit button initially", () => {
    render(<CreateAccountForm />);
    const submitButton = screen.getByRole("button", { name: "Create Account" });

    expect(submitButton).toBeDisabled();
  });

  it("toggles submit button disabled state based on validation status", async () => {
    render(<CreateAccountForm />);
    const submitButton = screen.getByRole("button", { name: "Create Account" });

    expect(submitButton).toBeDisabled();

    const nicknameInput = screen.getByRole("textbox", {
      name: "Account Nickname",
    });
    fireEvent.change(nicknameInput, { target: { value: "Nickname" } });
    expect(nicknameInput).toHaveValue("Nickname");
    fireEvent.blur(nicknameInput);
    waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("calls onCreate with correct values when submit button is clicked", async () => {
    const onCreate = jest.fn();
    render(<CreateAccountForm onCreate={onCreate} />);

    const nicknameInput = screen.getByRole("textbox", {
      name: "Account Nickname",
    });
    fireEvent.change(nicknameInput, { target: { value: "Nickname" } });
    fireEvent.blur(nicknameInput);
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    fireEvent.click(submitButton);
    waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        accountType: "everyday",
        nickname: "Nickname",
      });
    });
  });

  it("calls onCreate with correct values when chose savings account is clicked", async () => {
    const onCreate = jest.fn();
    render(<CreateAccountForm onCreate={onCreate} />);

    const nicknameInput = screen.getByRole("textbox", {
      name: "Account Nickname",
    });
    fireEvent.change(nicknameInput, { target: { value: "Nickname" } });
    const savingsRadio = screen.getByRole("radio", {
      name: "Savings account",
    });
    act(() => {
      fireEvent.click(savingsRadio);
    });

    const savingsGoalInput = await screen.getByRole("textbox", {
      name: "Savings Goal",
    });

    expect(savingsGoalInput).toBeInTheDocument();

    fireEvent.change(savingsGoalInput, { target: { value: 100000000 } });
    fireEvent.blur(savingsGoalInput);
    expect(
      await screen.findByText("Savings goal must be less than $1,000,000")
    ).toBeInTheDocument();

    fireEvent.change(savingsGoalInput, { target: { value: 1000 } });
    fireEvent.blur(savingsGoalInput);
    await waitFor(() =>
      expect(
        screen.queryByText("Savings goal must be less than $1,000,000")
      ).not.toBeInTheDocument()
    );
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    fireEvent.click(submitButton);
    waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        accountType: "savings",
        nickname: "Nickname",
        savingsGoal: 1000,
      });
    });
  });
});
