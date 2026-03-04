"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from '@/components/ui/image';
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { navCategories } from "@/data/nav-categories";

const productCategories = navCategories.map(category => ({
  name: category.name,
  href: `/collections/${category.slug}`
}));

// Pages with hero banners
const pagesWithHero = [
  '/',                    // Home page
  '/about',               // About page
  '/products',            // Products page
  '/innovation',          // Innovation page
  '/sustainability',      // Sustainability page
  '/contact',             // Contact page
];

// Check if a path starts with any of the collection paths
const isCollectionPage = (path: string) => {
  return path.startsWith('/collections/');
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [hasHero, setHasHero] = useState(true);

  // Determine if the current page has a hero banner
  useEffect(() => {
    const pageHasHero = pagesWithHero.includes(pathname) || isCollectionPage(pathname);
    setHasHero(pageHasHero);

    // If page doesn't have a hero, set sticky immediately
    if (!pageHasHero) {
      setIsSticky(true);
    } else {
      // Check initial scroll position
      if (window.scrollY > 60) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  }, [pathname]);

  useEffect(() => {
    // Only add scroll listener if the page has a hero
    if (!hasHero) return;

    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasHero]);

  return (
    <header
      className={cn(
        "w-full py-1 md:py-1 z-50 transition-all duration-300",
        isSticky
          ? "sticky-nav"
          : hasHero
            ? "bg-transparent absolute top-0 left-0 right-0"
            : "bg-white shadow-md"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-3">
            <div className="relative h-[75px] w-auto">
              {/* Use white logo for transparent header and color logo for sticky header or pages without hero */}
              {isSticky || !hasHero ? (
                <Image src="https://ik.imagekit.io/pon54xoks/Star%20Hi%20Herbs%20Green%20LOGO%2001.svg?updatedAt=1770631428073"
                  alt="Star Hi Herbs"
                  width={280}
                  height={70}
                  className="object-contain"
                  style={{ maxHeight: '75px' }}
                  priority
                />
              ) : (
                <Image src="https://ik.imagekit.io/pon54xoks/starhi-herbs%20-white-02.svg?updatedAt=1770631428126"
                  alt="Star Hi Herbs"
                  width={280}
                  height={70}
                  className="object-contain"
                  style={{ maxHeight: '75px', mixBlendMode: 'screen' }}
                  priority
                />
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>

            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link flex items-center gap-1">
                  Products <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 bg-white py-2">
                {productCategories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link
                      href={category.href}
                      className="px-4 py-2 hover:bg-gray-100 text-[#214842] hover:text-[#258F67] transition-colors duration-200 w-full text-left"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/innovation" className="nav-link">
              Innovation
            </Link>
            <Link href="/sustainability" className="nav-link">
              Sustainability
            </Link>
            <Link href="/blog" className="nav-link">
              Blog
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </nav>

          {/* Action Button (Desktop) */}
          <div className="hidden lg:flex items-center">
            <Button
              asChild
              className="cta-primary py-3 px-6 h-auto"
            >
              <Link href="/request-quote">Request Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden ${isSticky || !hasHero ? 'text-[#214842]' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-[#214842] font-medium py-2 hover:text-[#258F67]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-[#214842] font-medium py-2 hover:text-[#258F67]"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {/* Mobile Products with accordion effect */}
            <div className="border-b border-gray-100 pb-2">
              <button
                className="flex justify-between items-center w-full text-[#214842] font-medium py-2"
                onClick={(e) => {
                  e.preventDefault();
                  const submenu = document.getElementById("products-submenu");
                  if (submenu) {
                    submenu.classList.toggle("hidden");
                  }
                }}
              >
                <span>Products</span>
                <ChevronDown size={16} />
              </button>
              <div id="products-submenu" className="hidden pl-4 space-y-2 mt-2">
                {productCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block text-[#214842] hover:text-[#258F67] py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/innovation"
              className="text-[#214842] font-medium py-2 hover:text-[#258F67]"
              onClick={() => setIsMenuOpen(false)}
            >
              Innovation
            </Link>
            <Link
              href="/sustainability"
              className="text-[#214842] font-medium py-2 hover:text-[#258F67]"
              onClick={() => setIsMenuOpen(false)}
            >
              Sustainability
            </Link>
            <Link
              href="/blog"
              className="text-[#214842] font-medium py-2 hover:text-[#258F67]"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-[#214842] font-medium py-2 hover:text-[#258F67]"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <Button
              asChild
              className="cta-primary w-full justify-center mt-2"
            >
              <Link href="/request-quote">Request Quote</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
