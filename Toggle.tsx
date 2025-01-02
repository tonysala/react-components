import React from "react";

interface ToggleProps {
  id?: string,
  value: boolean,
  disabled?: boolean,
  size?: "sm" | "xs",
  onChange: (state: boolean) => void,
}

const Toggle = (props: ToggleProps) => {
  const {
    disabled = false,
    value,
    onChange,
    size = "sm",
  } = props;

  const handleChange = (checked: boolean) => {
    onChange(checked);
  };

  const classes = `flex items-center ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;

  const s = (c: string) => {
    const sizes: any = {
      sm: { w: "14", h: "8", d: "6", p: "1" },
      xs: { w: "7", h: "4", d: "3", p: "0.5" },
    };
    return sizes[size][c];
  }

  return (
    <div className={`relative ${classes}`} onClick={() => !disabled && handleChange(!value)}>
      {/* for tree shake: w-14 w-7 h-8 h-4 w-6 h-6 w-3 h-3 left-0.5 left-1 top-0.5 top-1 transform translate-x-6 transform translate-x-3 */}
      <div
        className={`block w-${s("w")} h-${s("h")} rounded-full transition duration-100 ease-in ${
          value ? "bg-green" : "bg-gray-600"
        }`}
      ></div>
      <div
        className={`dot absolute left-${s("p")} top-${s("p")} bg-white w-${s("d")} h-${s("d")} rounded-full 
          transition duration-100 ease-in ${value ? `transform translate-x-${s("d")}` : ""}`}
      ></div>
    </div>
  );
};

export default Toggle;