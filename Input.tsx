import React, { ChangeEvent, useState } from "react";
import { FormError } from "../../interfaces/FormError";

interface Limit {
  characters: number | null;
  show: boolean;
}

interface Rule {
  call: (input: string, state?: any) => boolean;
  message: string;
}

interface InputProps {
  id?: string;
  tip?: string;
  disabled?: boolean;
  clearable?: boolean;
  limit?: Limit;
  value: string;
  onChange: (value: string) => void;
  onValidate?: (error: any) => void;
  rules?: Rule[],
  placeholder?: string;
  prefix?: string;
  className?: string;
}

export const InputPrefix = ({prefix}: {prefix: string}) => {
  return (
    <span
      className="flex items-center px-4 text-gray-500 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md whitespace-nowrap"
    >
    {prefix}
    </span>
  );
};

export const Input = (props: InputProps) => {
  const [valid, setValid] = useState(true);
  const [errors, setErrors] = useState<FormError[]>([]);

  const {
    id = "",
    tip = "",
    disabled = false,
    onChange,
    onValidate,
    rules = [],
    value,
    className = "",
    placeholder = "",
    prefix = "",
    clearable = true,
    limit = { characters: null, show: false },
  } = props;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  const handleClear = () => {
    onChange("");
  };

  const validate = () => {
    const errors = rules?.filter((rule: Rule) => !rule.call(value));
    onValidate?.(errors.map((error: FormError) => error.message));
    setValid(errors?.length === 0);
    setErrors(errors);
    return errors?.length === 0;
  };

  const commonStyles: string = "px-4 py-2 border border-solid text-sm w-full";
  let variantStyles: string = "";

  if (valid) {
    variantStyles += " bg-white border-gray-300";
  } else {
    variantStyles += " bg-red-100 border-red-300";
  }

  if (disabled) {
    variantStyles += " opacity-50";
  }

  if (prefix) {
    variantStyles += " rounded-none rounded-r-md";
  } else {
    variantStyles += " rounded-md";
  }

  const classes = `${commonStyles} ${variantStyles} ${className}`;

  return (
    <div className="flex flex-grow flex-col gap-0.5">
      <div className="flex flex-grow relative text-sm">
        {prefix && (<InputPrefix prefix={prefix} />)}
        <input
          className={classes}
          placeholder={placeholder}
          id={id}
          data-tip={tip}
          disabled={disabled}
          onChange={handleInputChange}
          value={value}
          onBlur={() => validate()}
        />
        {clearable && value.length >= 1 && (
          <div className="absolute inset-y-0 right-0 flex items-center cursor-pointer" onClick={handleClear}>
            <span className="h-7 w-5 text-xl text-gray-400">&#x2715;</span>
          </div>
        )}
        {limit?.show && limit?.characters !== null && (
          <div className="absolute inset-y-0 right-2 flex items-center cursor-pointer">
            <span className="text-xs text-gray-500">{value.length}/{limit.characters - value.length}</span>
          </div>
        )}
      </div>
      {rules && (
        <div className="flex flex-col gap-1">
          {errors.length > 0 && (
            errors.map((error: any, i: number) => (
              <span key={i} className={"text-xs text-red-500 font-bold"}>{`${errors.length > 1 ? `${i+1}) ` : ""}`}
                {error.message}
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
};
