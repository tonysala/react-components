import React, { FC } from "react";
import { FormError } from "../../interfaces/FormError";

interface LabelledInputProps {
  label: string;
  description?: string|React.ReactNode;
  error?: FormError;
  children?: React.ReactNode;
}

export const LabelledInput: FC<LabelledInputProps> = ({ label, description, error, children }) => (
  <>
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-2 col-span-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500 text-sm">{description}</span>
        {error && (
          <span className="text-red-500">{error.message}</span>
        )}
      </div>
      <div className={"col-span-2"}>
        {children}
      </div>
    </div>
    <hr />
  </>
);
