import React from "react";

interface LoadingSpinnerProps {
  show: boolean;
  overlay?: boolean;
}

export const LoadingSpinner = ({ show, overlay = true }: LoadingSpinnerProps) => {

  if (!show) {
    return <></>;
  }

  return overlay ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        zIndex: 1000,
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(255,255,255,0.5)",
      }}
    >
      <div className="bg-white rounded-md p-6">
        <div
          style={{
            border: "0.25em solid #f3f3f3",
            borderRadius: "50%",
            borderTop: "0.25em solid #aaaaaa",
            width: "3em",
            height: "3em",
            animation: "spin 2s linear infinite",
          }}
        />
      </div>
    </div>
  ) : (
    <div className={`relative`}>
      <div
        style={{
          border: "2px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "50%",
          borderTop: "2px solid rgba(0, 0, 0, 1)",
          width: "20px",
          height: "20px",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
};