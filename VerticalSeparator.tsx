import React from "react";

export const VerticalSeparator = () => {
  return (
    <div className="flex m-1 mx-4">
      <div
        style={{
          borderLeft: `1px solid rgba(255,255,255,0.25)`,
          borderRight: `1px solid rgba(0,0,0,0.25)`,
          height: `100%`,
        }}
      />
    </div>
  );
};