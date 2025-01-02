import React, { ReactNode } from "react";

export enum AlertVariants {
  DANGER,
  SUCCESS,
  INFO,
  WARNING,
}

interface AlertProps {
  id?: string,
  tip?: string,
  children?: string | Element | ReactNode
  className?: string
  variant: AlertVariants,
  style?: any,
  size?: "sm" | "xs",
}

export const Alert = (props: AlertProps) => {

  const {
    id = "",
    tip = "",
    children = <></>,
    className = "",
    variant = AlertVariants.INFO,
    style = {},
    size = "sm",
  } = props;

  const commonStyles: string = `text-${size} rounded-md p-2`;
  let variantStyles: string;

  switch (variant) {
    case AlertVariants.DANGER:
      variantStyles = "alert-error text-red-600";
      break;
    case AlertVariants.SUCCESS:
      variantStyles = "alert-success text-green-600";
      break;
    case AlertVariants.INFO:
      variantStyles = "alert-info text-blue-600";
      break;
    case AlertVariants.WARNING:
      variantStyles = "alert-warning text-yellow-600";
      break;
  }

  const classes = `${commonStyles} ${variantStyles} ${className}`;

  return (
    <div
      className={classes}
      id={id}
      data-tip={tip}
      style={style}
    >
      {children}
    </div>
  );
};