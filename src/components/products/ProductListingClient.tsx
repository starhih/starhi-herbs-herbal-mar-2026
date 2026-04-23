'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, ProductCategory } from '@/data/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  X,
  SortAsc,
  SortDesc,
  Check
} from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Sort options
type SortOption = {
  label: string;
  value: string;
  sortFn: (a: Product, b: Product) => number;
};

const sortOptions: SortOption[] = [
  {
    label: 'Name (A-Z)',
    value: 'name-asc',
    sortFn: (a, b) => a.name.localeCompare(b.name)
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc',
    sortFn: (a, b) => b.name.localeCompare(a.name)
  },
  {
    label: 'Newest',
    value: 'newest',
    // This is a placeholder - in a real app, you'd use createdAt
    sortFn: (a, b) => 0
  },
];

interface ProductListingClientProps {
  category: ProductCategory;
  initialProducts: Product[];
}

export default function ProductListingClient({
  category,
  initialProducts
}: ProductListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const initialSearchQuery = searchParams.get('search') || '';
  const initialSortOption = searchParams.get('sort') || 'name-asc';
  const initialCertifications = searchParams.get('certifications')?.split(',') || [];

  // State
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOption, setSortOption] = useState(initialSortOption);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>(initialCertifications);

  const isBrandedIngredients = category.slug === 'branded-ingredients';

  const brandedIngredientsData = [
    {
      name: 'Turmimax',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/turmimax.jpg',
      url: 'https://turmimax.com/',
    },
    {
      name: 'Turmesac',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/turmesac.jpg',
      url: 'https://turmesac.in/',
    },
    {
      name: 'Forcslim',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/forcslim.jpg',
      url: 'https://forcslim.com/',
    },
    {
      name: 'Bacosane',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/bacosane.jpg',
      url: 'https://bacosane.com/',
    },
    {
      name: 'Cissuslean',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/cissusiean.jpg',
      url: 'https://cissuslean.com/',
    },
    {
      name: 'Curkolin',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/curkolin.jpg',
      url: 'https://curkolin.com/',
    },
    {
      name: 'Bacospore',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/bacospore.jpg',
      url: 'https://bacospore.com/',
    },
    {
      name: 'Salislim',
      imageUrl: 'https://ik.imagekit.io/pon54xoks/salislim.jpg',
      url: 'https://salislim.com/',
    }
  ];

  // Get all unique certifications from products
  const allCertifications = Array.from(
    new Set(
      initialProducts.flatMap(product => product.certifications || [])
    )
  ).sort();

  // Apply filters and sorting synchronously
  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.shortDescription?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.latinName?.toLowerCase().includes(query) ||
        product.standardization.toLowerCase().includes(query)
      );
    }

    // Apply certification filters
    if (selectedCertifications.length > 0) {
      filtered = filtered.filter(product =>
        selectedCertifications.every(cert =>
          product.certifications?.includes(cert as string)
        )
      );
    }

    // Apply sorting
    const selectedSortOption = sortOptions.find(option => option.value === sortOption);
    if (selectedSortOption) {
      filtered.sort(selectedSortOption.sortFn);
    }

    return filtered;
  }, [initialProducts, searchQuery, selectedCertifications, sortOption]);

  // Update URL string when states change (client-side only)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (sortOption !== 'name-asc') params.set('sort', sortOption);
    if (selectedCertifications.length > 0) params.set('certifications', selectedCertifications.join(','));

    // Prevent excessive history replacement by checking if it changed
    const newQueryString = params.toString();
    const currentQueryString = window.location.search.replace('?', '');
    
    if (newQueryString !== currentQueryString) {
      const newUrl = `${window.location.pathname}${newQueryString ? '?' + newQueryString : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchQuery, sortOption, selectedCertifications]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already applied via the useEffect
  };

  // Handle certification selection
  const handleCertificationChange = (certification: string, checked: boolean) => {
    if (checked) {
      setSelectedCertifications([...selectedCertifications, certification]);
    } else {
      setSelectedCertifications(selectedCertifications.filter(c => c !== certification));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSortOption('name-asc');
    setSelectedCertifications([]);
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder={`Search ${category.name.toLowerCase()}...`}
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </form>

        <div className="flex gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {sortOption === 'name-asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort Products</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortOption(option.value)}
                    className="flex items-center justify-between"
                  >
                    {option.label}
                    {sortOption === option.value && <Check size={16} className="text-green-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={18} />
                Filter
                {selectedCertifications.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCertifications.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Filter {category.name.toLowerCase()} by certifications and attributes.
                </SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <h3 className="text-sm font-medium mb-3">Certifications</h3>
                <div className="space-y-2">
                  {allCertifications.map((certification) => (
                    <div key={certification} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cert-${certification}`}
                        checked={selectedCertifications.includes(certification)}
                        onCheckedChange={(checked) =>
                          handleCertificationChange(certification, checked as boolean)
                        }
                      />
                      <Label htmlFor={`cert-${certification}`}>{certification}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
                <SheetClose asChild>
                  <Button className="mt-4">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCertifications.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')}>
                <X size={14} className="ml-1" />
              </button>
            </Badge>
          )}

          {selectedCertifications.map(cert => (
            <Badge key={cert} variant="secondary" className="flex items-center gap-1">
              {cert}
              <button onClick={() => handleCertificationChange(cert, false)}>
                <X size={14} className="ml-1" />
              </button>
            </Badge>
          ))}

          {(searchQuery || selectedCertifications.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="mt-8">
        {isBrandedIngredients ? (
          // Custom render for branded ingredients always shown
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-center place-items-center">
              {brandedIngredientsData.map((item) => (
                <a 
                  key={item.name}
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative w-full block rounded-2xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-auto object-cover"
                  />
                </a>
              ))}
            </div>
            
            {filteredProducts.length > 0 && (
              <div className="mt-16">
                <hr className="mb-10" />
                <h2 className="text-2xl font-bold text-[#214842] mb-6">Other Branded Ingredients</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full">
                <a href="/contact">Request more info about it</a>
              </Button>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-[#214842] mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              No products match your current filters.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
