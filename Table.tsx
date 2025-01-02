import React, { createContext, ReactNode, useContext } from "react";
import { LoadingSpinner } from "@components/LoadingSpinner";

interface TableProps {
  children: ReactNode,
  className?: string,
  loading?: boolean,
  columns?: number,
}

const TableContext = createContext<{
  isHeader: boolean,
}>({ isHeader: false });

const LoadingState = ({ columns }: {
  columns?: number
}) => (
  <Body>
    <Row>
      <Cell colSpan={columns} className="text-center">
        <LoadingSpinner show={true} overlay={false} />
      </Cell>
    </Row>
  </Body>
);

export const Table = ({ children, className = "", loading, columns = React.Children.count(children) }: TableProps) => (
  <table className={`min-w-full border rounded divide-y divide-gray-200 table-auto ${className}`}>
    {loading ? <LoadingState columns={columns} /> : children}
  </table>
);

export const Head = ({ children, className = "" }: {
  children: ReactNode,
  className?: string
}) => (
  <TableContext.Provider value={{ isHeader: true }}>
    <thead className={`bg-gray-100 ${className}`}>
    {children}
    </thead>
  </TableContext.Provider>
);

export const Body = ({ children, className = "" }: {
  children: React.ReactNode,
  className?: string
}) => (
  <TableContext.Provider value={{ isHeader: false }}>
    <tbody className={`divide-y divide-gray-150 ${className}`}>
    {children}
    </tbody>
  </TableContext.Provider>
);

export const Row = ({ children, className = "", onClick }: {
  children: React.ReactNode,
  className?: string,
  onClick?: () => void
}) => (
  <tr className={`items-center ${className}`} onClick={onClick}>
    {children}
  </tr>
);

interface CellProps {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  onClick?: () => void;
  isHeader?: boolean;
}

export const Cell = ({ children, className = "", colSpan, onClick, isHeader }: CellProps) => {
  isHeader = isHeader ?? useContext(TableContext).isHeader;
  const CellComponent = isHeader ? "th" : "td";
  const headerClasses = "text-xs font-medium tracking-wider text-left text-gray-500 uppercase";

  return (
    <CellComponent
      className={`px-6 py-2 align-center ${isHeader ? headerClasses : ""} ${className}`}
      colSpan={colSpan}
      onClick={onClick}
    >
      {children}
    </CellComponent>
  );
};