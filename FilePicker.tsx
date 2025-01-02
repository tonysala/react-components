import React, { ChangeEvent, FC } from "react";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
  allowedExtensions?: string[];
  onChange: (value: string) => void;
}

export const FilePicker: FC<Props> = (
  {
    value,
    onChange,
    className,
    allowedExtensions = [],
    disabled = false,
  }) => {
  return (
    <>
      <input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        type="file"
        className={className}
        disabled={disabled}
        accept={allowedExtensions.length > 0 ? allowedExtensions.toString() : ""}
      />
    </>
  )
};