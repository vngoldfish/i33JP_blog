import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="w-full mt-10">
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-green-500 text-black rounded disabled:opacity-50"
        >
          ← Trước
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={`px-4 py-2 rounded ${
              index === currentPage ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-green-500 text-black rounded disabled:opacity-50"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
