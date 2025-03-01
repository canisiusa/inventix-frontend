import React, { forwardRef, ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

export interface InputPropTypes {
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  label?: string;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  errorText?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event?: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event?: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hooksformvalidation?: object;
  prefixContent?: ReactNode;
  suffixContent?: ReactNode;
  variant?:
  | "primary"
  | "error"
  | "success"
  | "warning"
  | "gray";
}

const AppInput = forwardRef<HTMLInputElement, InputPropTypes>(
  function RoomeeInput(
    {
      type = "text",
      name,
      label,
      placeholder,
      labelClassName,
      inputClassName,
      errorText,
      required,
      maxLength,
      defaultValue,
      onChange,
      onKeyDown,
      disabled,
      hooksformvalidation,
      prefixContent,
      suffixContent,
      onFocus,
      variant = "primary",
      containerClassName,
      inputContainerClassName,
    },
    ref
  ) {
    const [inputType, setInputType] =
      useState<React.HTMLInputTypeAttribute>(type);

    useEffect(() => {
      if (defaultValue && onChange) {
        onChange({
          target: { value: defaultValue },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }, []);

    return (
      <Container
        className={cn(
          "w-full flex flex-col justify-start items-start",
          containerClassName
        )}
      >
        {label ? (
          <label
            className={cn(
              labelClassName,
              "text-sm mb-2",
            )}
          >
            {label}{" "}
            {required && (
              <span className="mb-2 ml-0.5 text-sm text-[var(--error-500)]">
                *
              </span>
            )}
          </label>
        ) : null}

        <div className="w-full flex-col justify-start items-start gap-1">
          <div
            className={cn(
              "w-full transition-all duration-200 px-4 py-2 rounded-lg gap-2",
              variablesInput[variant],
              inputContainerClassName,
              disabled && "cursor-not-allowed bg-[var(--bg-disabled)] ",
              errorText ? "!border-red-300 !border !focus:border-red-500 focus:!ring-1 focus:!ring-red-500" : ""
            )}
          >
            {prefixContent && <div>{prefixContent}</div>}
            {disabled ? (
              <span
                className={cn(
                  "w-full text-start focus:outline-none cursor-not-allowed bg-[var(--bg-disabled)]",
                  inputClassName
                )}
              >
                {defaultValue}
              </span>
            ) : (
              <input
                {...hooksformvalidation}
                aria-disabled={disabled}
                ref={ref}
                className={cn(
                  "w-full bg-transparent focus:outline-none text-base",
                  inputClassName
                )}
                placeholder={placeholder}
                maxLength={maxLength}
                type={inputType}
                name={name}
                defaultValue={defaultValue}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
              />
            )}
            <div className="justify-self-end cursor-pointer">
              {suffixContent ? (
                suffixContent
              ) : type === "password" ? (
                inputType === "password" ? (
                  <Icon
                    icon="octicon:eye-24"
                    onClick={() => setInputType("text")}
                  />
                ) : (
                  <Icon
                    icon="octicon:eye-closed-24"
                    onClick={() => setInputType("password")}
                  />
                )
              ) : null}
            </div>
          </div>
          {errorText ? <p className="text-sm text-left text-[var(--error-500)]">
            {errorText}
          </p> : null}
        </div>
      </Container>
    );
  }
);

AppInput.displayName = "RoomeeInput";

const variablesInput: Record<string, string> = {
  gray: "default-input",
  primary: "default-input input-primary",
  error: "default-input input-error",
  success: "default-input input-success",
  warning: "default-input input-warning",
};

const Container = styled.div`
  .default-input {
    font-weight: normal;
    display: flex;
    align-items: center;
    align-self: stretch;
    color: #475569;
  }


  .input-primary {
    border: 1px solid var(--border-primary);
    &:focus-within {
      border: 1px solid var(--brand-500);
    }
  }

  .input-error {
    border: 1px solid var(--error-500);
    &:focus-within {
      border: 1px solid var(--error-500);
    }
  }

  .input-success {
    border: 1px solid var(--success-500);
    &:focus-within {
      border: 1px solid var(--success-500);
    }
  }

  .input-warning {
    border: 1px solid var(--warning-500);
    &:focus-within {
      border: 1px solid var(--warning-500);
    }
  }

`;

export default AppInput;
