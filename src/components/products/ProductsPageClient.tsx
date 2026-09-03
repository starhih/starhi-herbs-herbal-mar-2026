'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCategory } from '@/data/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  X
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

interface ProductsPageClientProps {
  categories: ProductCategory[];
}

export default function ProductsPageClient({ 
  categories, 
}: ProductsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial values from URL params
  const initialSearchQuery = searchParams.get('search') || '';

  // State
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // If there's a search query, redirect to the first matching category
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      
      // Redirect to the first category with the search query
      if (categories.length > 0) {
        router.push(`/collections/${categories[0].slug}?${params.toString()}`);
      }
    }
  };

  // Handle category selection
  const handleCategorySelect = (slug: string) => {
    router.push(`/collections/${slug}`);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </form>

        <div className="flex gap-2">
          {/* Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={18} />
                Browse Categories
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Product Categories</SheetTitle>
                <SheetDescription>
                  Browse our product categories or use the search to find specific products.
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-4">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div 
                      key={category.id} 
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCategorySelect(category.slug)}
                    >
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      <div className="mt-1 text-xs text-[#258F67]">
                        {category.count} products
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <SheetFooter className="flex justify-between sm:justify-between">
                <SheetClose asChild>
                  <Button className="mt-4">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
