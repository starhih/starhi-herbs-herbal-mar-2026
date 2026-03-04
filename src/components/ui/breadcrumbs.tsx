'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BaseComponentProps } from '@/types/component';

/**
 * Interface for a breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

/**
 * Props for the Breadcrumbs component
 */
interface BreadcrumbsProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  showHomeLink?: boolean;
}

/**
 * Breadcrumbs component for navigation
 *
 * @param items - Array of breadcrumb items
 * @param showHomeLink - Whether to show the home link
 * @param className - Additional CSS classes
 */
export default function Breadcrumbs({
  items,
  showHomeLink = true,
  className = ''
}: BreadcrumbsProps) {
  // Validate items
  if (!items || !Array.isArray(items)) {
    console.error('Breadcrumbs: items must be an array');
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex flex-wrap items-center text-sm">
        {showHomeLink && (
          <li>
            <Link href="/" className="text-gray-500 hover:text-[#258F67] flex items-center">
              <Home size={14} className="mr-1" />
              <span>Home</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => (
          <li key={`breadcrumb-${index}-${item.label}`} className="flex items-center">
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            {item.isCurrent ? (
              <span aria-current="page" className="text-[#214842] font-medium">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="text-gray-500 hover:text-[#258F67]">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
