import React from "react";
import ReactSelect from "react-select";

export interface Option {
  value: string | number;
  label: string | Element | Function;
  selected?: boolean;
}

export interface BackedOption extends Option {
  model?: any;
}

type PossibleOption = Option | Option[] | BackedOption | BackedOption[] | null;

interface SelectProps {
  id?: string;
  tip?: string;
  disabled?: boolean;
  value?: PossibleOption;
  onChange: (selection: any) => void;
  options: Option[] | BackedOption[];
  className?: string;
  isLoading?: boolean | undefined;
  multiple?: boolean;
  hideSelected?: boolean;
  components?: any;
  closeMenuOnSelect?: boolean;
  loadingMessage?: ((obj: {
    inputValue: string
  }) => (string | null)) | undefined;
}

export const Select = (props: SelectProps) => {
  const {
    disabled = false,
    onChange,
    multiple = false,
    hideSelected = false,
    options = [],
    className = "",
    value,
    isLoading = undefined,
    loadingMessage = undefined,
    components = {},
    closeMenuOnSelect = true,
  } = props;

  const commonStyles: string = "text-sm text-sm rounded-md bg-white";
  let variantStyles: string = "";

  if (disabled) {
    variantStyles += " opacity-50";
  }

  const classes = `${commonStyles} ${variantStyles} ${className}`;

  return (
    <ReactSelect
      components={components}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      isDisabled={disabled}
      className={classes}
      classNamePrefix="select"
      value={value}
      options={options}
      closeMenuOnSelect={closeMenuOnSelect}
      isMulti={multiple}
      controlShouldRenderValue={!hideSelected}
      onChange={(option: any) => onChange(option)}
    />
  );
};
