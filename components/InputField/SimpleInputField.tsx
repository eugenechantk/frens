import React from "react";
import clsx from "clsx";
import _ from "lodash";
import { defaultFieldSkin, disabledFieldSkin, focusFieldSkin, IInputFieldProps, inputFieldStruc } from "./InputField";

export default function SimpleInputField({
  type = "text",
  required = true,
  disabled = false,
  ...props
}: IInputFieldProps) {

  return (
    <div className={`flex flex-col gap-2 w-full`}>
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
          type={type}
          className={clsx(
            inputFieldStruc,
            defaultFieldSkin,
            focusFieldSkin,
            disabledFieldSkin,
            props.className
          )}
          placeholder={props.placeholder}
          disabled={disabled}
          onChange={props.onChange}
          onInput={props.onInput}
        ></input>
      ) : (
        <textarea
          className={clsx(
            inputFieldStruc,
            defaultFieldSkin,
            focusFieldSkin,
            disabledFieldSkin,
            props.className
          )}
          placeholder={props.placeholder}
          disabled={disabled}
          rows={6}
          onChange={props.onChange}
          onInput={props.onInput}
        ></textarea>
      )}

      {props.helpText && (
        <p className="w-full text-sm leading-5 text-gray-400">
          {props.helpText}
        </p>
      )}
    </div>
  );
}