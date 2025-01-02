import React from "react";

interface StatusIndicatorProps {
  value: boolean,
  className?: string,
  tip?: string
}

export const StatusIndicator = ({ value, className = "", tip = "" }: StatusIndicatorProps) => {
  return (
    <div className={`flex ${className}`} title={tip}>
      <span className={`inline-block w-2 h-2 m-1 bg-${value ? "green" : "red"}-500 rounded-md`}></span>
    </div>
  );
};