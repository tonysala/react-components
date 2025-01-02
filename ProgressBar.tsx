import React from "react";

interface ProgressBarProps {
  tip?: string,
  className?: string
  size?: "xs" | "sm",
  style?: any,
  progress: number,
}

export const ProgressBar = (props: ProgressBarProps) => {

  const {
    tip = '',
    className = '',
    size = "xs",
    style = {},
    progress = 0
  } = props;

  const sizeClasses = size === "xs" ? "h-1" : "h-2";
  const classes = `relative bg-gray-200 w-full ${sizeClasses} ${className}`;

  return (
    <div
      className={classes}
      data-tip={tip}
      style={style}
    >
      <div
        className="bg-blue-500 h-full transition-width duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};