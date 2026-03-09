import Link from 'next/link';
import Image from '@/components/ui/image';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '@/data/types';

interface ProductCategoriesProps {
  categories: ProductCategory[];
}

export default function ProductCategories({ categories }: ProductCategoriesProps) {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Offerings</h6>
          <h2 className="text-[#214842] mb-4">Product Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of high-quality herbal extracts and nutraceutical ingredients designed for various health applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              href={`/collections/${category.slug}`}
              key={category.id}
              className="group product-card h-full flex flex-col border border-transparent hover:border-[#258F67]"
            >
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <Image
                  src={category.homepageImage || category.image || (category.name.includes("Vitamins") ? "https://ik.imagekit.io/pon54xoks/images/vitamins-minerals.jpg" : category.name.includes("Bulk") ? "https://ik.imagekit.io/pon54xoks/Bulk%20Formulations%2001.jpg" : "") || "/images/hero/standardized-herbal-extracts.jpeg"}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#214842]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-[#214842] mb-2 group-hover:text-[#258F67] transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {category.description}
                </p>
                <div className="flex items-center text-[#258F67] font-medium mt-auto">
                  <span>Explore Products</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
