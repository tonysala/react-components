import React, { ReactNode } from "react";

export enum BadgeVariants {
  DANGER,
  SUCCESS,
  INFO,
  NOTICE
}

interface TagProps {
  id?: string,
  tip?: string,
  children?: string | Element | ReactNode
  className?: string
  variant: BadgeVariants,
  size?: "xs" | "sm",
  style?: any,
}

export const Badge = (props: TagProps) => {

  const {
    id = '',
    children = <></>,
    className = '',
    variant = BadgeVariants.INFO,
    size = "sm",
    style = {},
  } = props;

  const commonStyles: string = `inline-flex items-center rounded-md px-1.5 py-0.5  text-${size} font-medium ring-1 ring-inset`;
  let variantStyles: string;

  switch (variant) {
    case BadgeVariants.DANGER:
      variantStyles = "bg-red-50 text-red-700 ring-red-600";
      break;
    case BadgeVariants.SUCCESS:
      variantStyles = "bg-green-50 text-green-500 ring-green-600";
      break;
    case BadgeVariants.INFO:
      variantStyles = "bg-blue-50 text-blue-700 ring-blue-700";
      break;
    case BadgeVariants.NOTICE:
      variantStyles = "bg-yellow-50 text-yellow-800 ring-yellow-600";
      break;
  }

  const classes = `${commonStyles} ${variantStyles} ${className}`

  return (<span id={id} className={classes} style={style}>{children}</span>);
};
