import React, { Children, FC, isValidElement, ReactElement, ReactNode, useState } from "react";
import { Row } from "@components/Table";

interface NestedRowContainerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  actions?: {
    onClick?: () => void,
    onExpand?: () => void,
    onCollapse?: () => void
  };
}

export const NestedRowContainer: FC<NestedRowContainerProps> = ({ children, actions }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const nestedRows: ReactNode[] = [];
  let rows: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === NestedRow) {
      nestedRows.push(child);
    } else if (isValidElement(child)) {
      rows.push(child);
    }
  });

  rows = rows.sort((a, b) => {
    if (isValidElement(a) && isValidElement(b) && a.type === Row && b.type !== Row) {
      return -1;
    } else if (isValidElement(a) && isValidElement(b) && a.type !== Row && b.type === Row) {
      return 1;
    }
    return 0;
  });

  if (nestedRows.length !== 1) {
    throw new Error("There should be exactly one NestedRow component in the container.");
  }

  const handleClick = () => {
    isExpanded ? actions?.onCollapse?.() : actions?.onExpand?.();
    setIsExpanded(!isExpanded);
    actions?.onClick?.();
  };

  return (
    <>
      {React.cloneElement(nestedRows[0] as ReactElement, { onClick: handleClick })}
      {isExpanded && rows}
    </>
  );
};

interface NestedRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NestedRow: FC<NestedRowProps> = ({ children, className = "", onClick }) => (
  <Row className={`items-center cursor-pointer ${className}`} onClick={onClick}>
    {children}
  </Row>
);
