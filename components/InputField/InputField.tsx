import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";
import clsx from "clsx";
import _ from "lodash";

interface IInputFieldProps {
  // for the input
  name: string;
  type?: "email" | "number" | "password" | "text" | "text-area";
  disabled?: boolean;
  placeholder?: string;

  // for the label
  label?: string;
  required?: boolean;

  // for the description below label
  description?: string;

  // for the helptext below input field
  helpText?: string;

  // onChange event listener
  onChange?: any;

  // default value
  defaultValue?: string;
}

export default function InputField({
  type = "text",
  required = true,
  disabled = false,
  ...props
}: IInputFieldProps) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error, clearError } =
    useField(props.name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <div className={` flex flex-col gap-2 w-full`}>
      {props.label && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-start gap-4">
            <label className="grow text-sm font-semibold text-gray-800 leading-5">
              {props.label}
            </label>
            {!required && (
              <p className="flex-none text-sm font-semibold text-gray-400 leading-5">
                Optional
              </p>
            )}
          </div>
          {props.description && (
            <p className="grow text-sm text-gray-500 leading-5">
              {props.description}
            </p>
          )}
        </div>
      )}
      {type != "text-area" ? (
        <input
          ref={inputRef}
          type={type}
          defaultValue={props.defaultValue ? props.defaultValue : defaultValue}
          className={clsx(
            inputFieldStruc,
            defaultFieldSkin,
            focusFieldSkin,
            disabledFieldSkin,
            error && errorFieldSkin
          )}
          placeholder={props.placeholder}
          disabled={disabled}
          onFocus={clearError}
          onChange={props.onChange}
        ></input>
      ) : (
        <textarea
          ref={inputRef}
          defaultValue={props.defaultValue ? props.defaultValue : defaultValue}
          className={clsx(
            inputFieldStruc,
            defaultFieldSkin,
            focusFieldSkin,
            disabledFieldSkin,
            error && errorFieldSkin,
          )}
          placeholder={props.placeholder}
          disabled={disabled}
          rows={6}
          onFocus={clearError}
        ></textarea>
      )}

      {props.helpText && (
        <p className="w-full text-sm leading-5 text-gray-400">
          {props.helpText}
        </p>
      )}
      {error && <p className="w-full text-sm leading-5 text-error">{_.upperFirst(error)}</p>}
    </div>
  );
}

const inputFieldStruc = clsx(
  // sizing
  "w-full px-4 py-5",
  // rounded
  "rounded-8",
);

const defaultFieldSkin = clsx(
  // border
  "border-secondary-300 border",
  // text
  "text-gray-800 text-base leading-5",
);

const focusFieldSkin = clsx(
  // border
  "focus:outline-2 focus:outline-primary-600",
);

const disabledFieldSkin = clsx(
  // border
  "disabled:border disabled:border-secondary-300 disabled:bg-secondary-300"
);

const errorFieldSkin = clsx(
  // border
  "focus:outline-error focus:outline-2 border-2 border-error text-error",
);
