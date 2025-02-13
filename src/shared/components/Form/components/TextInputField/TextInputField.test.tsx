import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextInputField, { TextInputFieldProps } from "../TextInputField";

describe("TextInputField Component", () => {
  const mockRegister = jest.fn();
  const mockValidate = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  const defaultProps: TextInputFieldProps<string> = {
    name: "test-input",
    register: mockRegister,
    validate: mockValidate,
    onChange: mockOnChange,
    onBlur: mockOnBlur,
    type: "text",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input element correctly", () => {
    render(<TextInputField {...defaultProps} />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    render(<TextInputField {...defaultProps} />);
    const inputElement = screen.getByRole("textbox");

    fireEvent.change(inputElement, { target: { value: "Hello" } });
    expect(mockOnChange).toHaveBeenCalledWith("Hello");
  });

  it("calls onBlur and validate when input loses focus", () => {
    render(<TextInputField {...defaultProps} />);
    const inputElement = screen.getByRole("textbox");

    fireEvent.blur(inputElement, { target: { value: "Test" } });
    expect(mockValidate).toHaveBeenCalledWith("test-input");
    expect(mockOnBlur).toHaveBeenCalledWith("Test");
  });

  it("formats input correctly when type is 'money'", () => {
    render(<TextInputField {...defaultProps} type="money" />);
    const inputElement = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "1000000" } });
    expect(inputElement.value).toBe("1,000,000");
  });

  it("registers field on mount", () => {
    render(<TextInputField {...defaultProps} />);
    expect(mockRegister).toHaveBeenCalledWith(
      "test-input",
      expect.any(Object),
      expect.objectContaining({ validators: expect.any(Array) })
    );
  });
});
