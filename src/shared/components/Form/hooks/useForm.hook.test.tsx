import { act, renderHook } from "@testing-library/react";
import { ValidationResult } from "@/shared/validators/types";
import useForm, { validateFieldValue } from "./useForm.hook";
import {
  FieldHandler,
  FormFieldUnregisterHandler,
  FormFieldValues,
  Validator,
} from "../types";

const mockValidator = (async (
  value: FormFieldValues
): Promise<ValidationResult> => {
  return value
    ? { errorMessage: "", isValid: true }
    : { errorMessage: "Required", isValid: false };
}) as unknown as Validator<FormFieldValues>;

const createMockRef = (value: FormFieldValues) =>
  ({
    current: { value: () => value },
  } as React.RefObject<FieldHandler<FormFieldValues>>);

describe("useForm hook", () => {
  it("should register a field", () => {
    const { result } = renderHook(() => useForm());

    const mockRef = createMockRef("testValue");

    act(() => {
      result.current.register("testField", mockRef);
    });

    expect(result.current.getValue("testField")).toBe("testValue");
  });

  it("should unregister a field", () => {
    const { result } = renderHook(() => useForm());

    const mockRef = createMockRef("testValue");
    let unregister: FormFieldUnregisterHandler;
    act(() => {
      unregister = result.current.register("testField", mockRef).unregister;
      expect(unregister).toBeDefined();
    });

    expect(result.current.getValue("testField")).toBe("testValue");

    act(() => {
      unregister();
    });

    expect(() => result.current.getValue("testField")).toThrow(
      "Field with name testField is not registered"
    );
  });

  it("should validate a registered field", async () => {
    const { result } = renderHook(() => useForm());

    const mockRef = createMockRef("");
    act(() => {
      result.current.register("testField", mockRef, {
        validators: [mockValidator],
      });
    });

    await act(async () => {
      const validationResult = await result.current.validate("testField");
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorMessage).toBe("Required");
    });
  });

  it("should validate all fields", async () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.register(
        "field1",
        { current: { value: () => "valid" } } as React.RefObject<
          FieldHandler<FormFieldValues>
        >,
        { validators: [mockValidator] }
      );
      result.current.register(
        "field2",
        { current: { value: () => "" } } as React.RefObject<
          FieldHandler<FormFieldValues>
        >,
        { validators: [mockValidator] }
      );
    });

    await act(async () => {
      const validationResults = await result.current.validateAll();
      expect(validationResults[0].isValid).toBe(true);
      expect(validationResults[1].isValid).toBe(false);
    });
  });

  it("should return form values", () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.register("name", createMockRef("Alice"));
      result.current.register("email", createMockRef("alice@example.com"));
    });

    expect(result.current.values()).toEqual({
      name: "Alice",
      email: "alice@example.com",
    });
  });

  it("should clear errors when validation passes", async () => {
    const { result } = renderHook(() => useForm());

    const mockRef = createMockRef("");
    act(() => {
      result.current.register("testField", mockRef, {
        validators: [mockValidator],
      });
    });

    await act(async () => {
      await result.current.validate("testField");
    });

    expect(result.current.getValue("testField")).toBe("");

    act(() => {
      mockRef.current.value = () => "valid";
    });

    await act(async () => {
      await result.current.validate("testField");
    });

    expect(result.current.getValue("testField")).toBe("valid");
  });

  it("should validate field value helper function", async () => {
    const result = await validateFieldValue("", [mockValidator]);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Required");

    const validResult = await validateFieldValue("valid", [mockValidator]);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errorMessage).toBe(null);
  });
});
