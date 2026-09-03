import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, Home, Building, Package, Lightbulb, Leaf, BookOpen, Mail, FileText, Users, Award } from 'lucide-react';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { getPayloadClient } from '@/lib/payload';
import { mapCategory, mapBlogCategory } from '@/lib/mappers';

export const metadata: Metadata = {
  title: 'Sitemap | Star Hi Herbs',
  description: 'Navigate through all pages on the Star Hi Herbs website with our comprehensive sitemap. Find products, company information, and resources easily.',
  keywords: 'sitemap, navigation, Star Hi Herbs, website map, pages, products, company information',
  alternates: {
    canonical: '/sitemap',
  },
  openGraph: {
    title: 'Sitemap | Star Hi Herbs',
    description: 'Navigate through all pages on the Star Hi Herbs website with our comprehensive sitemap. Find products, company information, and resources easily.',
    url: '/sitemap',
    type: 'website',
    images: [
      {
        url: 'https://ik.imagekit.io/pon54xoks/website.jpg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap | Star Hi Herbs',
    description: 'Navigate through all pages on the Star Hi Herbs website with our comprehensive sitemap. Find products, company information, and resources easily.',
    images: ['https://ik.imagekit.io/pon54xoks/website.jpg'],
  },
};

export default async function SitemapPage() {
  const payload = await getPayloadClient();

  // Fetch product categories, blog categories, and products concurrently
  const [
    { docs: categoryDocs },
    { docs: blogCategoryDocs },
    { docs: productDocs },
  ] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
    }),
    payload.find({
      collection: 'blog-categories',
      limit: 100,
    }),
    payload.find({
      collection: 'products',
      limit: 5000,
      select: { slug: true, name: true, productType: true },
    }),
  ]);

  const productCategories = categoryDocs.map((c) => mapCategory(c as any)).filter(Boolean) as any[];
  const blogCategories = blogCategoryDocs.map(mapBlogCategory).filter(Boolean) as any[];

  const allProducts = productDocs.map((p) => {
    let url = `/products/${p.slug}`;
    if (p.productType === 'branded') url = `/branded-ingredients/${p.slug}`;
    if (p.productType === 'vitamin-mineral') url = `/vitamins-minerals/${p.slug}`;
    return {
      id: p.id,
      name: p.name,
      url,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Group products alphabetically
  const productAlphabetGroups: { [key: string]: any[] } = {};
  allProducts.forEach((product) => {
    const firstLetter = product.name.trim().charAt(0).toUpperCase();
    const groupKey = /^[A-Z]/.test(firstLetter) ? firstLetter : '#';
    if (!productAlphabetGroups[groupKey]) {
      productAlphabetGroups[groupKey] = [];
    }
    productAlphabetGroups[groupKey].push(product);
  });

  const sortedProductGroupKeys = Object.keys(productAlphabetGroups).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  sortedProductGroupKeys.forEach((key) => {
    productAlphabetGroups[key].sort((a, b) => a.name.localeCompare(b.name));
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#214842] text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-full">
                <Map className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="mb-4">Website Sitemap</h1>
            <p className="text-xl text-white/90">
              Navigate through all pages and sections of our website with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Sitemap', href: '/sitemap', isCurrent: true }
            ]}
          />
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-[#214842] mb-4">Find What You&apos;re Looking For</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                This sitemap provides an organized overview of all pages and sections on our website. 
                Use it to quickly navigate to the information you need.
              </p>
            </div>

            {/* Sitemap Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Main Pages */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-[#258F67]" />
                  Main Pages
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Products Overview
                    </Link>
                  </li>
                  <li>
                    <Link href="/innovation" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Innovation
                    </Link>
                  </li>
                  <li>
                    <Link href="/sustainability" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Sustainability
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Product Categories */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-[#258F67]" />
                  Product Categories
                </h3>
                <ul className="space-y-3">
                  {productCategories.map((category) => (
                    <li key={category.id}>
                      <Link 
                        href={`/collections/${category.slug}`} 
                        className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center"
                      >
                        <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blog & Resources */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-[#258F67]" />
                  Blog & Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/blog" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Blog Home
                    </Link>
                  </li>
                  {blogCategories.map((category) => (
                    <li key={category.id}>
                      <Link 
                        href={`/blog/category/${category.slug}`} 
                        className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 ml-2"></span>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Services */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-[#258F67]" />
                  Business Services
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/request-quote" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Request Quote
                    </Link>
                  </li>
                  <li>
                    <Link href="/request-sample" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Request Sample
                    </Link>
                  </li>
                  <li>
                    <Link href="/request-meeting" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Request Meeting
                    </Link>
                  </li>
                  <li>
                    <Link href="/download-catalogue" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Download Catalogue
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Specialized Sections */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-[#258F67]" />
                  Specialized Sections
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/collections/branded-ingredients" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Branded Ingredients
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections/vitamins-minerals" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Natural Vitamins & Minerals
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections/probiotics" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Probiotics
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal & Policies */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#258F67]" />
                  Legal & Policies
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/privacy-policy" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/sitemap" className="text-gray-600 hover:text-[#258F67] transition-colors flex items-center">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-3"></span>
                      Sitemap
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Products A-Z Directory to resolve Orphan Pages */}
            <div className="mt-16 bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h3 className="text-2xl font-semibold text-[#214842] mb-6 flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-[#258F67]" />
                Complete Products Directory (A-Z)
              </h3>
              <p className="text-gray-600 mb-8">
                Browse our entire portfolio of botanical extracts, custom formulations, vitamins, minerals, and probiotics.
              </p>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {sortedProductGroupKeys.map((key) => (
                  <div key={key} className="space-y-3">
                    <div className="text-xl font-bold text-[#258F67] border-b pb-1 border-gray-200">
                      {key}
                    </div>
                    <ul className="space-y-2">
                      {productAlphabetGroups[key].map((product) => (
                        <li key={product.id}>
                          <Link
                            href={product.url}
                            className="text-gray-600 hover:text-[#258F67] text-sm transition-colors duration-150 inline-block py-0.5"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="mt-16 bg-gray-50 rounded-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-[#214842] mb-4">Quick Navigation</h3>
                <p className="text-gray-600">
                  Looking for something specific? Use these quick links to jump to popular sections.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-auto py-3 px-4 flex flex-col items-center space-y-2">
                  <Link href="/products">
                    <Package className="h-5 w-5" />
                    <span className="text-sm">All Products</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-3 px-4 flex flex-col items-center space-y-2">
                  <Link href="/about">
                    <Building className="h-5 w-5" />
                    <span className="text-sm">About Us</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-3 px-4 flex flex-col items-center space-y-2">
                  <Link href="/blog">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-sm">Blog</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-3 px-4 flex flex-col items-center space-y-2">
                  <Link href="/contact">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">Contact</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-[#214842] mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
            <p className="text-gray-600 mb-8">
              If you can&apos;t find the information you need on this sitemap, our team is here to help you navigate our website and find the right solutions.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-[#258F67]" />
                <a href="mailto:starhi@starhiherbs.com" className="text-[#214842] hover:text-[#258F67] transition-colors">
                  starhi@starhiherbs.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} className="text-[#258F67]" />
                <span className="text-gray-600">Available 24/7 for assistance</span>
              </div>
            </div>
            <Button asChild className="cta-primary">
              <Link href="/contact" className="flex items-center">
                Get Help
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
