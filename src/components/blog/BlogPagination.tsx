'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

export default function BlogPagination({ currentPage, totalPages, baseUrl, className = '' }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page, last page, current page, and pages adjacent to current page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push(null); // Ellipsis
      }
      
      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(null); // Ellipsis
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {/* Previous page button */}
      <Button
        asChild
        variant="outline"
        disabled={currentPage === 1}
        className="border-gray-300 hover:bg-gray-100 hover:text-[#214842]"
      >
        <Link 
          href={currentPage === 1 ? '#' : `${baseUrl}?page=${currentPage - 1}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Link>
      </Button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === null) {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            asChild={currentPage !== page}
            variant={currentPage === page ? "default" : "outline"}
            className={
              currentPage === page 
                ? "bg-[#214842] hover:bg-[#214842]/90 text-white" 
                : "border-gray-300 hover:bg-gray-100 hover:text-[#214842]"
            }
          >
            {currentPage === page ? (
              <span>{page}</span>
            ) : (
              <Link href={`${baseUrl}?page=${page}`}>
                {page}
              </Link>
            )}
          </Button>
        );
      })}
      
      {/* Next page button */}
      <Button
        asChild
        variant="outline"
        disabled={currentPage === totalPages}
        className="border-gray-300 hover:bg-gray-100 hover:text-[#214842]"
      >
        <Link 
          href={currentPage === totalPages ? '#' : `${baseUrl}?page=${currentPage + 1}`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Link>
      </Button>
    </div>
  );
}
