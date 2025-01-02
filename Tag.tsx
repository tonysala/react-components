import React, { ReactNode } from "react";

export enum TagVariants {
  DANGER,
  SUCCESS,
  INFO,
  NOTICE,
  GRAY
}

interface TagProps {
  id?: string,
  tip?: string,
  children?: string | Element | ReactNode
  className?: string
  variant: TagVariants,
  size?: "xs" | "sm",
  style?: any,
}

export const Tag = (props: TagProps) => {

  const {
    id = '',
    tip = '',
    children = <></>,
    className = '',
    variant = TagVariants.INFO,
    size = "sm",
    style = {},
  } = props;

  const commonStyles: string = `text-${size} font-mono rounded-md m-1 p-1 uppercase font-bold`;
  let variantStyles: string;

  switch (variant) {
    case TagVariants.DANGER:
      variantStyles = "bg-red-100 text-red-500";
      break;
    case TagVariants.SUCCESS:
      variantStyles = "bg-green-100 text-green-500";
      break;
    case TagVariants.INFO:
      variantStyles = "bg-blue-100 text-blue-500";
      break;
    case TagVariants.NOTICE:
      variantStyles = "bg-yellow-100 text-yellow-600";
      break;
    case TagVariants.GRAY:
      variantStyles = "bg-gray-200 text-gray-500";
      break;
  }

  const classes = `${commonStyles} ${variantStyles} ${className}`

  return (
    <div
      className={classes}
      id={id}
      title={tip}
      style={style}
    >
      {children}
    </div>
  );
};
