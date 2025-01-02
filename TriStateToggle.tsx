import React, { useEffect, useState } from "react";

export enum ToggleState {
  TRUE,
  FALSE,
  EITHER,
}

export const toggleStateValue = (state: ToggleState) => {
  switch (state) {
    case ToggleState.TRUE:
      return true;
    case ToggleState.FALSE:
      return false;
    case ToggleState.EITHER:
    default:
      return null;
  }
};

interface TriStateToggleProps {
  initialState?: ToggleState,
  disabled?: boolean,
  onChange: (state: ToggleState) => void,
}

const TriStateToggle = (props: TriStateToggleProps) => {
  const {
    disabled = false,
    initialState = ToggleState.EITHER,
    onChange,
  } = props;

  const [state, setState] = useState<ToggleState>(initialState);
  const [previousState, setPreviousState] = useState<ToggleState>(ToggleState.FALSE);

  useEffect(() => {
    if (initialState === ToggleState.EITHER) {
      setState(ToggleState.EITHER);
    }
  }, [initialState]);

  const classes = `flex items-center ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;

  const states = {
    0: { next: ToggleState.FALSE, bg: "bg-green", pos: "transform translate-x-6" },
    1: { next: ToggleState.EITHER, bg: "bg-red", pos: "" },
    2: { next: ToggleState.TRUE, bg: "bg-gray-600", pos: "transform translate-x-3" },
  };

  const handleChange = () => {
    let nextState;
    if (state === ToggleState.EITHER) {
      nextState = previousState === ToggleState.TRUE ? ToggleState.FALSE : ToggleState.TRUE;
    } else {
      nextState = ToggleState.EITHER;
    }
    onChange(nextState);
    setPreviousState(state);
    setState(nextState);
  };

  return (
    <div className={classes}>
      <div
        className="relative"
        onClick={() => !disabled && handleChange()}
      >
        <div
          className={`block w-14 h-8 rounded-full transition duration-100 ease-in ${states[state].bg}`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition duration-100 ease-in ${states[state].pos}`}
        ></div>
      </div>
    </div>
  );
};

export default TriStateToggle;
