import React from "react";

const HomePagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border px-4 py-2 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-4 py-2">
        Page {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border px-4 py-2 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default HomePagination;
