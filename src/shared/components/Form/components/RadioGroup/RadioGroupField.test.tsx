import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RadioGroup, { RadioGroupProps } from "./RadioGroup";

describe("RadioGroup Component", () => {
  const mockRegister = jest.fn(() => ({ unregister: jest.fn() }));
  const mockOnChange = jest.fn();

  const defaultProps: RadioGroupProps = {
    name: "test-radio-group",
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
    ],
    defaultValue: "option1",
    onChange: mockOnChange,
    register: mockRegister,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders radio buttons correctly", () => {
    render(<RadioGroup {...defaultProps} />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(2);
    expect(radioButtons[0]).toBeChecked();
    expect(radioButtons[1]).not.toBeChecked();
  });

  it("calls onChange when a radio button is selected", () => {
    render(<RadioGroup {...defaultProps} />);
    const radioButtons = screen.getAllByRole("radio");

    fireEvent.click(radioButtons[1]);
    expect(mockOnChange).toHaveBeenCalledWith("option2");
    expect(radioButtons[1]).toBeChecked();
    expect(radioButtons[0]).not.toBeChecked();
  });

  it("registers and unregister field on mount and unmount", () => {
    const unregister = jest.fn();
    const mockRegister = jest.fn(() => ({ unregister }));
    const { unmount } = render(
      <RadioGroup {...defaultProps} register={mockRegister} />
    );
    expect(mockRegister).toHaveBeenCalledWith(
      "test-radio-group",
      expect.any(Object),
      expect.objectContaining({ validators: [] })
    );

    unmount();
    expect(unregister).toHaveBeenCalled();
  });

  it("respects the default value", () => {
    render(<RadioGroup {...defaultProps} defaultValue="option2" />);
    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[1]).toBeChecked();
    expect(radioButtons[0]).not.toBeChecked();
  });
});
