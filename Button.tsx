import React, { MouseEventHandler, ReactNode } from "react";

export enum ButtonVariants {
  DANGER,
  SUCCESS,
  INFO,
  GRAY,
}

interface ButtonProps {
  id?: string;
  tip?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: string | Element | ReactNode;
  className?: string;
  variant: ButtonVariants;
  style?: any;
}

export const Button = (props: ButtonProps) => {

  const {
    id = "",
    tip = "",
    disabled = false,
    type = "button",
    children = <></>,
    onClick = (event) => event.preventDefault(),
    className = "",
    variant = ButtonVariants.INFO,
    style = {},
  } = props;

  const commonStyles: string = "px-4 py-2 border border-transparent text-sm rounded-md";
  let variantStyles: string;

  switch (variant) {
    case ButtonVariants.DANGER:
      variantStyles = "bg-red hover:bg-red-600 focus:ring-red-500 focus:outline-none text-white";
      break;
    case ButtonVariants.SUCCESS:
      variantStyles = "bg-green hover:bg-green-600 focus:ring-green-500 focus:outline-none text-white";
      break;
    case ButtonVariants.INFO:
      variantStyles = "bg-orange hover:bg-orange-400 focus:ring-orange focus:outline-none text-white";
      break;
    case ButtonVariants.GRAY:
      variantStyles = "bg-gray-200 hover:bg-gray-300 focus:ring-gray focus:outline-none text-gray-600";
      break;
  }

  if (disabled) {
    variantStyles += " opacity-50 cursor-not-allowed ";
  }

  const classes = `${commonStyles} ${variantStyles} ${className}`;

  return (
    <button
      className={classes}
      type={type}
      id={id}
      data-tip={tip}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};
