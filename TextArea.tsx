import React, { ChangeEvent } from "react";

interface TextAreaProps {
  id?: string
  tip?: string
  disabled?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  size?: { rows: number }
}

export const TextArea = (props: TextAreaProps) => {

  const {
    id = '',
    tip = '',
    disabled = false,
    onChange,
    value,
    className = "",
    placeholder = "",
    size = { rows: 10 },
  } = props;

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value
    onChange(newValue)
  }

  const commonStyles: string = "px-4 py-2 border border-gray-300 border-solid text-sm rounded-md bg-white w-full";
  let variantStyles: string = "";

  if (disabled) {
    variantStyles += " opacity-50";
  }

  const classes = `${commonStyles} ${variantStyles} ${className}`

  return (
    <div className="flex flex-grow">
      <textarea
        className={classes}
        placeholder={placeholder}
        id={id}
        data-tip={tip}
        disabled={disabled}
        onChange={handleInputChange}
        value={value}
        rows={size.rows}
      />
    </div>
  );
};