'use client';

import React from 'react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { RichText } from '@/components/RichText';
import ProductFAQs from '@/components/products/ProductFAQs';
import { 
  Coffee, 
  Award, 
  Sun, 
  Flame, 
  RefreshCw, 
  Droplet, 
  Layers, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { Product, ProductCategory } from '@/data/types';

interface DecaffeinatedCoffeePageProps {
  category: ProductCategory;
  products: Product[];
}

export default function DecaffeinatedCoffeePage({ category, products }: DecaffeinatedCoffeePageProps) {
  const hasDescription = category.longDescription && (category.longDescription as any).root && (category.longDescription as any).root.children && (category.longDescription as any).root.children.length > 0;
  const hasFaqs = category.faqs && category.faqs.length > 0;

  // Key stats for counters
  const stats = [
    { value: '3,000 MT', label: 'Decaffeination Capacity', sublabel: 'Per Annum' },
    { value: '6,000 MT', label: 'Total Extraction Capacity', sublabel: 'Across 2 Facilities' },
    { value: '100%', label: 'Active Recovery', sublabel: 'Caffeine & Chlorogenic Acid' },
    { value: 'Zero', label: 'Spent Biomass Waste', sublabel: '100% Bio-Fuel Reuse' },
  ];

  // 4 Core processing benefits
  const processPillars = [
    {
      title: 'Premium Decaffeination',
      desc: 'Produces premium-grade decaffeinated coffee beans utilizing controlled water/solvent extraction loops.',
      icon: Coffee,
      color: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      title: 'Preserve Natural Aroma',
      desc: 'Sophisticated low-temperature drying technology designed to lock in and preserve the natural aroma and complex flavor profile.',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      title: 'Caffeine By-Product Recovery',
      desc: 'Efficient recovery of highly purified caffeine as a valuable commercial by-product for pharmaceutical and beverage applications.',
      icon: RefreshCw,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      title: 'Chlorogenic Acid Extraction',
      desc: 'Reclaims high-value chlorogenic acid from processing streams, refining it into a premium-grade nutraceutical ingredient.',
      icon: Droplet,
      color: 'bg-purple-50 text-purple-700 border-purple-100',
    },
  ];

  // 4 Sustainability pillars
  const sustainabilityPillars = [
    {
      title: 'Progressive Electrification',
      desc: 'Electrification of manufacturing operations powered by integrated solar generation, reducing grid dependence and lowering our carbon footprint.',
      icon: Sun,
    },
    {
      title: 'Spent Biomass Bio-Fuel',
      desc: 'Spent coffee and botanical biomass generated post-extraction is repurposed as boiler fuel, replacing fossil fuels in a circular economy model.',
      icon: Flame,
    },
    {
      title: 'Closed-Loop Solvent Recovery',
      desc: 'High-efficiency closed-loop solvent recovery systems that minimize solvent losses, slash emissions, and enhance absolute environmental compliance.',
      icon: RefreshCw,
    },
    {
      title: 'Dedicated Treatment Plants (ETP)',
      desc: 'State-of-the-art Effluent Treatment Plants (ETPs) operating at our manufacturing facilities to ensure clean water discharge and eco-friendly waste management.',
      icon: Droplet,
    },
  ];

  // 9 Key Differentiators vs. Peers
  const differentiators = [
    {
      title: 'Fully Integrated Capabilities',
      desc: 'End-to-end capabilities spanning botanical extraction, enrichment, purification, probiotic fermentation, and specialty coffee beans.',
      icon: Layers,
    },
    {
      title: 'Commercial-Scale Operations',
      desc: 'Robust manufacturing infrastructure with approximately 6,000 MT per annum botanical extraction capacity across two specialized production facilities.',
      icon: TrendingUp,
    },
    {
      title: 'Continuous Batch Processing',
      desc: 'Continuous batch processing integrated with closed-loop systems, delivering high distillation efficiency, controlled temperatures, and maximum yields.',
      icon: RefreshCw,
    },
    {
      title: 'Extensive Purification Setup',
      desc: 'Dedicated SS316 reactor systems for high-purity active enrichment, crystallization, custom formulation, and specialized ingredient development.',
      icon: ShieldCheck,
    },
    {
      title: 'Advanced Analytical & QA Control',
      desc: 'State-of-the-art analytical testing suite including HPLC, GC, LC-MS, microbiology, and global quality assurance systems ensuring total compliance.',
      icon: Zap,
    },
    {
      title: 'High-Potency Custom Ingredients',
      desc: 'Expertise in developing standardized, high-potency, and highly customized customer-specific active ingredients rather than generic commodity extracts.',
      icon: Sparkles,
    },
    {
      title: 'Diversified Manufacturing Platform',
      desc: 'Broad platform covering botanical extracts, probiotics, essential oils, oleoresins, specialty coffee ingredients, and purified phytochemicals.',
      icon: CheckCircle2,
    },
    {
      title: 'Pioneering Circular Sustainability',
      desc: 'Integrated solar power, spent biomass boilers, and advanced solvent recovery systems that reduce carbon intensity and waste streams.',
      icon: Sun,
    },
    {
      title: 'Complete Supply Chain Traceability',
      desc: 'Absolute end-to-end control from raw material sourcing and extraction to purification, testing, and shipping, ensuring unparalleled supply reliability.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[480px] flex items-center">
        <Image
          src={category.heroImage || '/images/products/Coffee Bean 1.jpg'}
          fallbackSrc={category.heroImageFallback || '/images/products/Coffee Bean 1.jpg'}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#214842]/90 via-[#214842]/70 to-transparent"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <div className="inline-block mb-4">
              <span className="bg-[#EFC368] text-[#214842] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                <Coffee size={14} className="animate-pulse" /> Speciality Coffee Launch
              </span>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-shadow-md">
              {category.name}
            </h1>
            <div className="w-20 h-1.5 bg-[#EFC368] mb-6 rounded-full"></div>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-xl">
              {category.description || 'A state-of-the-art Speciality Decaffeination Processing Facility utilizing controlled water/solvent extraction and sophisticated drying technology.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="cta-primary py-4 px-8 text-base font-semibold shadow-lg">
                <Link href="#inquire">Inquire Now</Link>
              </Button>
              <Button asChild className="bg-transparent border border-white text-white hover:bg-white/10 hover:text-white py-4 px-8 text-base font-semibold transition-colors duration-200">
                <Link href="/request-sample">Request Samples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs Section */}
      <section className="py-4 bg-gray-50 border-b border-gray-100">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: category.name, href: `/collections/${category.slug}`, isCurrent: true }
            ]}
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100/80 transition-all hover:shadow-md duration-300">
                <div className="text-3xl md:text-4xl font-extrabold text-[#258F67] mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-[#214842] leading-tight mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speciality Coffee Bean Decaffeination Facility */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h6 className="text-[#258F67] uppercase tracking-widest mb-2.5 font-bold text-sm">Industrial Precision</h6>
              <h2 className="text-[#214842] text-3xl md:text-4xl font-semibold mb-6 leading-tight">
                Speciality Coffee Bean Decaffeination Processing Plant
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our newly commissioned state-of-the-art processing facility boasts an installed capacity of approximately <strong>3,000 MT per annum</strong>. 
                Utilizing highly controlled water/solvent extraction loops alongside sophisticated low-temperature drying systems, we ensure the delicate cell structures of the coffee beans are preserved.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                This dual-objective process maintains the highest sensory quality for the decaffeinated beans while actively capturing and purifying valuable chemical compounds from the processing stream as high-potency nutraceuticals.
              </p>
              <div className="p-5 bg-emerald-50/70 border-l-4 border-[#258F67] rounded-r-xl">
                <div className="flex gap-4 items-start">
                  <Award className="text-[#258F67] w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#214842] mb-1">Aroma and Flavor Preservation</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By regulating temperature profiles and water extraction rates, the natural organoleptic compounds of the beans remain undisturbed, resulting in premium, full-bodied flavour decaffeinated coffee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-6">
                {processPillars.map((pillar, index) => {
                  const IconComponent = pillar.icon;
                  return (
                    <div key={index} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${pillar.color}`}>
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-[#214842] mb-2.5">{pillar.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{pillar.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Manufacturing & Circular economy */}
      <section className="section-padding bg-[#214842] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_1px]"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h6 className="text-[#EFC368] uppercase tracking-widest mb-3.5 font-bold text-sm">Eco-Conscious Philosophy</h6>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
              Sustainable Manufacturing & Resource Efficiency
            </h2>
            <div className="w-16 h-1 bg-[#EFC368] mx-auto mb-6 rounded-full"></div>
            <p className="text-white/80 text-lg leading-relaxed">
              At Star Hi Herbs, sustainability is deeply integrated into our manufacturing philosophy. 
              We implement advanced circular manufacturing methods to significantly reduce waste, minimize carbon footprint, and enhance resource efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sustainabilityPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/15 hover:-translate-y-1 duration-300 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#EFC368] text-[#214842] flex items-center justify-center mb-5 shadow-inner">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed flex-grow">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Products Section */}
      {products.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-widest mb-2 font-bold text-sm">Product Portfolio</h6>
              <h2 className="text-[#214842] text-3xl font-semibold mb-4">Our Decaffeinated Products</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Explore our premium-grade products launched from this state-of-the-art facility.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <div className="relative h-56 w-full bg-gray-100">
                    <Image
                      src={product.image || '/images/products/coffee-bean-extract-2.jpg'}
                      fallbackSrc={product.imageFallback || '/images/products/coffee-bean-extract-2.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <span className="text-xs font-semibold text-[#258F67] uppercase tracking-wider mb-2 block">
                      {product.categoryName || 'Decaffeinated Coffee'}
                    </span>
                    <h3 className="text-xl font-bold text-[#214842] mb-3">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-6 flex-grow">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="space-y-2 text-xs text-gray-500 mb-6 bg-gray-50 p-4 rounded-xl">
                      {product.standardization && (
                        <div className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="font-semibold">Standardization:</span>
                          <span className="text-[#214842] font-medium">{product.standardization}</span>
                        </div>
                      )}
                      {product.moq && (
                        <div className="flex justify-between">
                          <span className="font-semibold">MOQ Size:</span>
                          <span className="text-[#214842] font-medium">{product.moq}</span>
                        </div>
                      )}
                    </div>
                    <Button asChild className="cta-primary w-full justify-center">
                      <Link href={`/products/${product.slug}`}>
                        View Details <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Differentiators vs. Industry Peers */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h6 className="text-[#258F67] uppercase tracking-widest mb-3 font-bold text-sm">Competitive Advantage</h6>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#214842] mb-5">
              Why Star Hi Herbs? Key Differentiators
            </h2>
            <div className="w-16 h-1 bg-[#258F67] mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 leading-relaxed">
              We stand apart through our world-class, integrated infrastructure, process engineering excellence, and unwavering focus on circular sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((diff, index) => {
              const IconComp = diff.icon;
              return (
                <div key={index} className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#258F67] flex items-center justify-center flex-shrink-0">
                    <IconComp size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#214842] mb-2.5">{diff.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{diff.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CMS Rich Text Long Description & FAQs (If configured in admin) */}
      {(hasDescription || hasFaqs) && (
        <section className="py-16 bg-white border-t border-b border-gray-100">
          <div className="container-custom max-w-4xl mx-auto">
            {hasDescription && (
              <div className="mb-16">
                <h2 className="text-3xl font-semibold text-[#214842] mb-8 text-center">Detailed Information</h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <RichText content={category.longDescription} />
                </div>
              </div>
            )}
            
            {hasFaqs && (
              <div className="mt-12 pt-12 border-t border-gray-100">
                <h2 className="text-3xl font-semibold text-[#214842] mb-8 text-center">Frequently Asked Questions</h2>
                <ProductFAQs faqs={category.faqs || []} className="bg-transparent shadow-none px-0" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lead Capture and CTA Section */}
      <section id="inquire" className="section-padding bg-gradient-to-br from-[#214842] to-[#258F67] text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="bg-[#EFC368] text-[#214842] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 inline-block">
                B2B Global Supply
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white mb-6">
                Request Specifications & Bulk Quotations
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Ready to source premium decaffeinated coffee beans or recovered phytochemicals? 
                Our commercial production lines are active, serving the global nutraceutical, food & beverage, functional food, and pharmaceutical industries.
              </p>
              <div className="space-y-4 text-white/90">
                <div className="flex gap-3 items-center">
                  <div className="w-5 h-5 bg-[#EFC368] rounded-full flex items-center justify-center text-[#214842] flex-shrink-0 text-xs font-bold">✓</div>
                  <span>HighDistillation Efficiency & Custom Moq Sizes</span>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-5 h-5 bg-[#EFC368] rounded-full flex items-center justify-center text-[#214842] flex-shrink-0 text-xs font-bold">✓</div>
                  <span>Traceable Raw Material Sourcing and HPLC/GC QA Validation</span>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-5 h-5 bg-[#EFC368] rounded-full flex items-center justify-center text-[#214842] flex-shrink-0 text-xs font-bold">✓</div>
                  <span>Decaffeinated and Standardised Coffee Bean Extracts available</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white rounded-3xl p-8 text-gray-800 shadow-xl border border-white/10">
              <h3 className="text-2xl font-semibold text-[#214842] mb-2">Connect with our Experts</h3>
              <p className="text-sm text-gray-500 mb-6">Submit your specification and custom quantity requirements, and we will get back to you within 24 hours.</p>
              
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button asChild className="cta-primary py-4 justify-center h-auto text-sm font-bold shadow-md">
                    <Link href="/request-quote">
                      Request a Custom Quote <ArrowRight size={16} className="ml-1.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white py-4 justify-center h-auto text-sm font-bold transition-all">
                    <Link href="/request-sample">
                      Request Free Sample <ArrowRight size={16} className="ml-1.5" />
                    </Link>
                  </Button>
                </div>
                
                <div className="text-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
                  By clicking, you will be taken to our high-converting lead request portals pre-configured for decaffeinated coffee beans.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
