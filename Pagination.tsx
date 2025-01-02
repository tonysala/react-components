import React, { ReactNode, useEffect, useState } from "react";
import { range } from "lodash";

interface PaginationProps {
  totalPages: number,
  currentPage: number,
  perPage?: number,
  total?: number,
  showPaginationInfo?: boolean,
  onPageChange: (page: number) => void,
}

export const Pagination = (props: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(props.currentPage ?? 1);
  const maxVisiblePages = 10;

  // Update component if page changes externally
  useEffect(() => setCurrentPage(props.currentPage), [props.currentPage]);

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  let pages: number[] = range(startPage, endPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page >= props.totalPages) {
      return;
    }
    setCurrentPage(page);
    props.onPageChange(page);
  };

  interface PaginationButtonProps {
    children: ReactNode;
    label: string;
    target?: number;
    disabled?: boolean;
    active?: boolean;
  }

  const PaginationButton = (props: PaginationButtonProps) => {
    const {
      children,
      label,
      target,
      disabled = false,
      active = false,
    } = props;

    return (
      <div
        className={`pagination-link ${disabled ? "disabled" : ""} ${active ? "active" : ""}`}
        aria-label={label}
        onClick={() => !disabled && target && handlePageChange(target)}
      >
        {children}
      </div>
    );
  };

  const PaginationInfo = () => {
    if (props.showPaginationInfo && props.total && props.perPage) {
      const bounds = {
        lower: ((props.currentPage - 1) * props.perPage) + 1,
        upper: Math.min(props.total, props.currentPage * props.perPage),
      };
      return (
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700 leading-5 m-0">
            Showing
            <span className="font-bold"> {bounds.lower}</span> to
            <span className="font-bold"> {bounds.upper}</span> of
            <span className="font-bold"> {props.total}</span> results
          </p>
        </div>
      );
    }

    return <></>;
  };

  return (
    <div className="relative z-0 inline-flex rounded-md pagination">
      <PaginationInfo />
      <PaginationButton label="Previous page" disabled={currentPage === 1} target={currentPage - 1}>
        <PrevIcon />
      </PaginationButton>
      {pages.length > 0 && !pages.includes(1) && (
        <>
          <PaginationButton
            label={`Page 1`}
            target={1}
            active={false}
          >
            <span>{1}</span>
          </PaginationButton>
          <PaginationButton
            label={`...`}
            disabled={true}
          >
            <span>...</span>
          </PaginationButton>
        </>
      )}
      {pages.map((page: number, index: number) => (
        <PaginationButton
          key={index}
          label={`Page ${page}`}
          disabled={page === currentPage}
          target={page}
          active={page === currentPage}
        >
          <span>{page}</span>
        </PaginationButton>
      ))}
      {pages.length > 0 && props.totalPages > 0 && !pages.includes(props.totalPages - 1) && (
        <>
          <PaginationButton
            label={`...`}
            disabled={true}
          >
            <span>...</span>
          </PaginationButton>
          <PaginationButton
            label={`Page ${props.totalPages}`}
            target={props.totalPages}
            active={false}
          >
            <span>{props.totalPages}</span>
          </PaginationButton>
        </>
      )}
      <PaginationButton label="Next page" disabled={currentPage === props.totalPages} target={currentPage + 1}>
        <NextIcon />
      </PaginationButton>
    </div>
  );
};

const PrevIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const NextIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    ></path>
  </svg>
);
