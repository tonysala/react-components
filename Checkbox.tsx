import React from "react";

interface CheckboxProps {
  id?: string,
  value: boolean,
  disabled?: boolean,
  onChange: (state: boolean) => void,
}

export const Checkbox = (props: CheckboxProps) => {
  const {
    disabled = false,
    value = false,
    onChange,
  } = props;

  const classes = `flex items-center`;

  return (
    <div className={`relative ${classes}`}>
      <input
        type={"checkbox"}
        checked={value}
        className={disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        onChange={() => !disabled && onChange(!value)}
      />
    </div>
  );
};
