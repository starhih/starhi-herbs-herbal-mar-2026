import Image from '@/components/ui/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, Globe, Leaf, CheckCircle, Building, Beaker, FileCheck, FileText, Mail, PhoneCall, Linkedin } from 'lucide-react';
import { Metadata } from 'next';

import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Us | Star Hi Herbs - Top Herbal Extract Manufacturer & Exporter',
  description: 'Learn about Star Hi Herbs, the world\'s leading manufacturer and exporter of standardized herbal extracts, premium Coleus & Sesamin extracts, and probiotics.',
  keywords: 'herbal extract manufacturer and exporter in bangalore, top herbal extract manufacturer and exporter in india, Coleus manufacturer and exporter in india, Sesamin extract manufacturer and exporter in the world, b2b herbal extracts, nutraceutical ingredients, probiotics, Star Hi Herbs, Firoz Hussain',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Star Hi Herbs - Top Herbal Extract Manufacturer & Exporter',
    description: 'Learn about Star Hi Herbs, the world\'s leading manufacturer and exporter of standardized herbal extracts, premium Coleus & Sesamin extracts, and probiotics.',
    url: '/about',
    siteName: 'Star Hi Herbs',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://ik.imagekit.io/pon54xoks/website.jpg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs - About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Star Hi Herbs - Top Herbal Extract Manufacturer & Exporter',
    description: 'Learn about Star Hi Herbs, the world\'s leading manufacturer and exporter of standardized herbal extracts, premium Coleus & Sesamin extracts, and probiotics.',
    images: ['https://ik.imagekit.io/pon54xoks/website.jpg'],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://starhiherbs.com/about"
          },
          url: "https://starhiherbs.com/about",
          name: "About Star Hi Herbs Pvt Ltd",
          description: "Star Hi Herbs Pvt Ltd is a leading manufacturer and exporter of standardized herbal extracts, branded nutraceutical ingredients, and probiotics.",
          publisher: {
            "@id": "https://starhiherbs.com/#organization"
          }
        }}
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/About-Star-Hi-Herbs-01.jpg"
          alt="Star Hi Herbs Manufacturing Facility"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">About Star Hi Herbs</h1>
            <p className="text-xl text-white text-shadow-sm">
              Pioneering Natural Innovation Since 2004
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Who We Are</h6>
            <h2 className="text-[#214842] mb-6">Star Hi Herbs Pvt Ltd</h2>
            <p className="text-gray-600 leading-relaxed">
              Star Hi Herbs Pvt Ltd is a leading manufacturer and exporter of standardized herbal extracts,
              branded nutraceutical ingredients, and probiotics, delivering natural solutions to health
              and wellness industries across the globe.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Founded in 2004 in Bangalore, India, by Mr. Firoz Hussain, a chemical engineer with deep
              industry insight, Star Hi Herbs began its journey with a bold vision: to blend ancient herbal
              wisdom with cutting-edge science. Over the years, the company has transformed into a global force,
              known for scientific rigor, sustainable practices, and premium quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Purpose</h6>
              <h2 className="text-[#214842] mb-6">Mission & Vision</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#214842] mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    "To empower people to achieve their best health, vitality, and well-being through natural
                    and innovative solutions that support a long, active life."
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#214842] mb-2">Our Vision</h3>
                  <p className="text-gray-600">
                    "To be a global leader in wellness innovation, setting high standards for quality,
                    sustainability, and product efficacy in herbal extracts and nutraceuticals."
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/images/mission-vision.jpg"
                alt="Star Hi Herbs Laboratory"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Journey Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Journey</h6>
            <h2 className="text-[#214842] mb-6">Growing Through The Years</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to a global presence, our journey reflects our commitment to quality,
              innovation, and sustainable growth.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#214842]/20 hidden md:block"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* 2004 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-12">
                    <div className="bg-[#214842] text-white text-xl font-bold py-1 px-4 rounded-full inline-block mb-3">2004</div>
                    <h3 className="text-xl font-semibold text-[#214842] mb-2">Humble Beginnings</h3>
                    <ul className="text-gray-600 space-y-2 list-disc md:list-none pl-5 md:pl-0">
                      <li>Founded as Hi Herbs Extract Udyog, a proprietary firm.</li>
                      <li>Started operations with 8 employees in a leased facility in Bangalore's Electronic City.</li>
                      <li>Focused on small-scale job work for other herbal companies.</li>
                    </ul>
                  </div>
                  <div className="hidden md:block"></div>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#258F67] border-4 border-white hidden md:block"></div>
                </div>
              </div>

              {/* 2008 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div className="md:pl-12">
                    <div className="bg-[#214842] text-white text-xl font-bold py-1 px-4 rounded-full inline-block mb-3">2008</div>
                    <h3 className="text-xl font-semibold text-[#214842] mb-2">Scaling with Vision</h3>
                    <ul className="text-gray-600 space-y-2 list-disc pl-5">
                      <li>Acquired 1 acre industrial land in Jigani Industrial Area, Bangalore.</li>
                      <li>Built a custom-engineered manufacturing facility with 3,000+ MT raw material capacity.</li>
                      <li>Began production of Coleus, Curcumin, Sesamin, and Shilajit.</li>
                      <li>Started contract farming for raw material control and quality consistency.</li>
                    </ul>
                  </div>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#258F67] border-4 border-white hidden md:block"></div>
                </div>
              </div>

              {/* 2012 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-12">
                    <div className="bg-[#214842] text-white text-xl font-bold py-1 px-4 rounded-full inline-block mb-3">2012</div>
                    <h3 className="text-xl font-semibold text-[#214842] mb-2">Incorporation & Expansion</h3>
                    <ul className="text-gray-600 space-y-2 list-disc md:list-none pl-5 md:pl-0">
                      <li>Converted to Star Hi Herbs Pvt Ltd with 45+ employees.</li>
                      <li>Introduced new extracts like Cissus, Tribulus, Gymnema, Kidney Bean.</li>
                      <li>Established an in-house laboratory for QC and product development.</li>
                    </ul>
                  </div>
                  <div className="hidden md:block"></div>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#258F67] border-4 border-white hidden md:block"></div>
                </div>
              </div>

              {/* 2016 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div className="md:pl-12">
                    <div className="bg-[#214842] text-white text-xl font-bold py-1 px-4 rounded-full inline-block mb-3">2016</div>
                    <h3 className="text-xl font-semibold text-[#214842] mb-2">New Horizons</h3>
                    <ul className="text-gray-600 space-y-2 list-disc pl-5">
                      <li>Purchased 5 acres in Hassan SEZ Pharma Zone.</li>
                      <li>Launched a world-class manufacturing facility with 6,000+ MT input capacity.</li>
                      <li>Hired 60+ employees and invested in HPLC, GC, and UV testing.</li>
                      <li>Intensified focus on R&D, branded products, and clinical validation.</li>
                      <li>Launched products like Lutein & Zeaxanthin (Tagetes erecta).</li>
                    </ul>
                  </div>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#258F67] border-4 border-white hidden md:block"></div>
                </div>
              </div>

              {/* 2018 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-12">
                    <div className="bg-[#214842] text-white text-xl font-bold py-1 px-4 rounded-full inline-block mb-3">2018</div>
                    <h3 className="text-xl font-semibold text-[#214842] mb-2">Global Recognition</h3>
                    <ul className="text-gray-600 space-y-2 list-disc md:list-none pl-5 md:pl-0">
                      <li>Employed over 120 professionals.</li>
                      <li>Established a Research Lab recognized by DSIR, Govt. of India.</li>
                      <li>Formed strategic partnerships with SuanFarma (USA) and NutraOriginal (Europe).</li>
                      <li>Expanded product lines including Ashwagandha, Bacopa, Holy Basil, Ginger.</li>
                    </ul>
                  </div>
                  <div className="hidden md:block"></div>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#258F67] border-4 border-white hidden md:block"></div>
                </div>
              </div>

              {/* 2021 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div className="md:pl-12">
                    <div className="bg-[#214842] text-white text-xl font-bold py-1 px-4 rounded-full inline-block mb-3">2021</div>
                    <h3 className="text-xl font-semibold text-[#214842] mb-2">Breaking Barriers</h3>
                    <ul className="text-gray-600 space-y-2 list-disc pl-5">
                      <li>Reached a milestone turnover of ₹100+ Cr per annum.</li>
                      <li>Commissioned a dedicated Probiotics Unit in Hassan with 24 MT/year capacity.</li>
                    </ul>
                  </div>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#258F67] border-4 border-white hidden md:block"></div>
                </div>
              </div>

              {/* 2023 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-12">
                    <div className="bg-[#214842] text-white text-xl font-bold py-1 px-4 rounded-full inline-block mb-3">2023</div>
                    <h3 className="text-xl font-semibold text-[#214842] mb-2">Strengthening R&D</h3>
                    <ul className="text-gray-600 space-y-2 list-disc md:list-none pl-5 md:pl-0">
                      <li>Expanded research publications with clinical, in vitro, and in vivo studies.</li>
                      <li>Began active distribution in South Korea.</li>
                      <li>Launched new branded ingredients: Forcslim™, Turmimax®, Bacosane®, etc.</li>
                    </ul>
                  </div>
                  <div className="hidden md:block"></div>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#258F67] border-4 border-white hidden md:block"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="bg-[#214842] text-white py-16">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Impact</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Star Hi Herbs has grown to become a significant player in the global herbal extract industry
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-white/80">Herbal Ingredients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">9+</div>
              <div className="text-white/80">clinical trials</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-white/80">International Certifications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">550+</div>
              <div className="text-white/80">Global Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-white/80">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Values</h6>
            <h2 className="text-[#214842] mb-4">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image: 'https://ik.imagekit.io/pon54xoks/Innovation.jpg',
                title: 'Innovation',
                description: 'We invest in R&D, product development, and clinical studies to create market-leading, high-efficacy products.',
              },
              {
                image: 'https://ik.imagekit.io/pon54xoks/Integrity.jpg',
                title: 'Integrity',
                description: 'We follow transparent, ethical, and responsible practices across sourcing, manufacturing, and business dealings.',
              },
              {
                image: 'https://ik.imagekit.io/pon54xoks/Quality.jpg',
                title: 'Quality',
                description: 'Our products meet the strictest global quality standards — ISO, WHO-GMP, FSSC, HACCP, Halal, Kosher, and AYUSH GMP certified.',
              },
              {
                image: 'https://ik.imagekit.io/pon54xoks/Sustainability.jpg',
                title: 'Sustainability',
                description: 'Through contract farming, GAP education, and organic clusters, we promote long-term agricultural sustainability and farmer welfare.',
              },
            ].map((value, index) => (
              <div key={index} className="relative rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group min-h-[300px] flex flex-col justify-end">
                <Image src={value.image} alt={value.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#214842] via-[#214842]/60 to-transparent"></div>
                <div className="relative z-10 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-white/90 text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Team</h6>
            <h2 className="text-[#214842] mb-4">Leadership</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our experienced leadership team combines deep industry knowledge with a passion for innovation.
            </p>
          </div>

          {/* Founder Spotlight */}
          <div className="mb-16">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:grid md:grid-cols-3 gap-0">
                <div className="relative h-80 md:h-auto">
                  <Image src="https://ik.imagekit.io/pon54xoks/images/hm-firoz-hussain-01.jpg"
                    alt="Mr. Firoz Hussain"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 md:col-span-2 flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold text-[#214842] mb-1">Mr. HM Firoz Hussain</h3>
                  <div className="text-[#258F67] font-medium mb-4">Founder & Managing Director</div>
                  <div className="mb-4">
                    <Link 
                      href="https://www.linkedin.com/in/firoz-hm/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#258F67] hover:text-[#0077b5] transition-colors"
                      title="Mr. HM Firoz Hussain on LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  </div>
                  <p className="text-gray-600 mb-4">
                    A dynamic chemical engineer from Dayananda Sagar College, Bangalore, with over 30 years in herbal extraction,
                    product development, and business strategy. Mr. Hussain is the driving force behind Star Hi Herbs' growth,
                    known for his innovation, vision, and commitment to excellence.
                  </p>
                  <blockquote className="italic text-gray-700 border-l-4 border-[#258F67] pl-4 py-2">
                    "We are here not just to manufacture herbal extracts, but to redefine what quality, sustainability,
                    and science-backed innovation mean in the natural health industry."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Najish N Nadaf',
                position: 'Vice President Global Marketing',
                image: 'https://ik.imagekit.io/pon54xoks/najish-n-nadaf%20.jpg',
                bio: 'MBA – Karnataka University. 20+ years in B2B marketing, international sales, and strategic partnerships.',
                linkedin: 'https://www.linkedin.com/in/najish/',
              },
              {
                name: 'Balamurali Krishna K',
                position: 'Director – Technical & Business Development',
                image: '/images/balamurali.jpeg',
                bio: 'Chemical Engineer, PGDM (IIMM). 30+ years in manufacturing, plant operations, quality and business development.',
                linkedin: 'https://www.linkedin.com/in/balamurali-krishna-k-balu-52403b1b0/',
              },
              {
                name: 'Radhakrishna Patil',
                position: 'Vice President Operations & Unit Head',
                image: 'https://ik.imagekit.io/pon54xoks/radhakrishna-patil.jpg',
                bio: 'MSc in Chemistry – Mangalore University. 20+ years in Quality Assurance and Regulatory Affairs.',
              },
              {
                name: 'Dr. Sadashiv CT',
                position: 'Vice President R&D & Unit Head',
                image: 'https://ik.imagekit.io/pon54xoks/dr-sadashiva.jpg',
                bio: 'PhD – Mysore University, Postdoc – University of Kwa Zulunatal, South Africa. 25+ years in herbal R&D and clinical research.',
                linkedin: 'https://www.linkedin.com/in/sadashiva-channangihalli-57352620/',
              },
              {
                name: 'Youhan Hussain',
                position: 'Global Business Head',
                image: 'https://ik.imagekit.io/pon54xoks/youhan-hussain.jpg',
                bio: 'MBA in Marketing – University of Liverpool. 5+ years in international client development and channel management.',
              },
              {
                name: 'Chetan Bhasin',
                position: 'Financial Advisor',
                image: 'https://ik.imagekit.io/pon54xoks/chetan-bhasin.jpg',
                bio: 'Chartered Accountant & PGDBA (IIM). 20+ years in finance, operations, and business strategy.',
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden group">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#214842] mb-1">{member.name}</h3>
                  <div className="text-[#258F67] font-medium mb-2">{member.position}</div>
                  {member.linkedin && (
                    <div className="mb-3">
                      <Link 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#258F67] hover:text-[#0077b5] transition-colors"
                        title={`${member.name} on LinkedIn`}
                      >
                        <Linkedin className="h-5 w-5" />
                      </Link>
                    </div>
                  )}
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Snapshot */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Facilities</h6>
            <h2 className="text-[#214842] mb-6">World-Class Manufacturing</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our state-of-the-art manufacturing facilities are designed to meet the highest international standards
              for quality, efficiency, and sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Jigani Unit */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image src="https://ik.imagekit.io/pon54xoks/Jigani%2001.jpg"
                  alt="Jigani Manufacturing Unit"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#214842]/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">Jigani Unit (Bangalore)</h3>
                  <p className="text-white/90 text-sm">Established 2008</p>
                </div>
              </div>
              <div className="p-6">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>Specialized in Coleus, Curcumin, Sesamin, and Shilajit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>3,000+ MT raw material processing capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>Custom-engineered extraction facility</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Hassan SEZ Unit */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image src="https://ik.imagekit.io/pon54xoks/Hassan%2001.jpg"
                  alt="Hassan SEZ Manufacturing Unit"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#214842]/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">Hassan SEZ Unit</h3>
                  <p className="text-white/90 text-sm">Established 2016</p>
                </div>
              </div>
              <div className="p-6">
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>Dual facilities for Herbal Extracts and Probiotics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>6,000+ MT input capacity for herbal extracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>24 MT/year capacity for probiotics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>European-compliant production standards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Accreditations */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Quality Assurance</h6>
            <h2 className="text-[#214842] mb-6">Certifications & Accreditations</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We adhere to the highest international standards in safety, traceability, and quality.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: 'ISO 9001:2015',
                description: 'Quality Management System',
                image: '/images/certifications/iso.png',
              },
              {
                name: 'FSSC 22000',
                description: 'Food Safety Management',
                image: '/images/certifications/fssc.png',
              },
              {
                name: 'WHO GMP Certified',
                description: 'Meets WHO Good Manufacturing Practices',
                image: '/images/certifications/who-gmp.jpg',
              },
              {
                name: 'Organic Certified',
                description: 'USDA & EU Organic Standards',
                image: '/images/certifications/organic.jpg',
              },
              {
                name: 'Kosher Certified',
                description: 'Meets Kosher Requirements',
                image: '/images/certifications/kosher.jpg',
              },
              {
                name: 'Halal Certified',
                description: 'Meets Halal Requirements',
                image: '/images/certifications/halal-1.jpg',
              },
              {
                name: 'FSSAI Certified',
                description: 'Meets Indian Food Safety Standards',
                image: '/images/certifications/fssai.jpg',
              },
              {
                name: 'GMP Certified',
                description: 'Good Manufacturing Practices',
                image: '/images/certifications/gmp.jpg',
              },
            ].map((cert, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-[#214842] mb-1">{cert.name}</h3>
                  <p className="text-gray-600 text-sm font-medium">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Sustainability at Heart</h6>
              <h2 className="text-[#214842] mb-6">Our Commitment to the Planet</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  At Star Hi Herbs, sustainability isn't just a buzzword—it's at the core of everything we do.
                  Our commitment extends from farm to finished product, ensuring that our growth supports both
                  environmental health and community wellbeing.
                </p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>20,000+ acres under contract farming across South India</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>Training farmers in Good Agricultural Practices (GAP)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>Building a 1,000-acre Organic Export Cluster</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-[#258F67] mt-1 flex-shrink-0" />
                    <span>Partnered with Agricultural Universities for sustainable cultivation innovation</span>
                  </li>
                </ul>
              </div>
              <Button asChild className="mt-6 cta-secondary">
                <Link href="/sustainability" className="flex items-center">
                  Learn More About Our Initiatives
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/images/csr.jpg"
                alt="Sustainable Farming"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Excellence Recognized</h6>
            <h2 className="text-[#214842] mb-6">Awards & Recognition</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our commitment to quality and innovation has been recognized by industry leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Times Business Award */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#258F67] group">
              <div className="relative h-full min-h-[250px] flex items-stretch overflow-hidden">
                <div className="absolute inset-0">
                  <Image src="https://ik.imagekit.io/pon54xoks/times-business-award-2020.jpg"
                    alt="Times Business Award 2020, 2026"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/60 to-black/90 md:from-transparent md:via-black/70 md:to-black/95"></div>
                </div>
                <div className="hidden md:block md:w-1/3 object-cover"></div>
                <div className="relative w-full md:w-2/3 p-6 z-10 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-white drop-shadow-md mb-2">Times Business Award 2020, 2026</h3>
                  <p className="text-white/90 drop-shadow-md leading-relaxed">Excellence in Herbal Extract Manufacturing</p>
                </div>
              </div>
            </div>

            {/* World Signature Award */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#258F67] group">
              <div className="relative h-full min-h-[250px] flex items-stretch overflow-hidden">
                <div className="absolute inset-0">
                  <Image src="https://ik.imagekit.io/pon54xoks/world-signature-award-2023.jpg"
                    alt="World Signature Award 2023"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/60 to-black/90 md:from-transparent md:via-black/70 md:to-black/95"></div>
                </div>
                <div className="hidden md:block md:w-1/3 object-cover"></div>
                <div className="relative w-full md:w-2/3 p-6 z-10 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-white drop-shadow-md mb-2">World Signature Award 2023</h3>
                  <p className="text-white/90 drop-shadow-md leading-relaxed">Innovation in Standardization and R&D</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="text-center mt-10">
            <div className="inline-flex items-center justify-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm">
              <span className="text-[#214842] font-medium">Our Research Impact:</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#258F67]" />
                  <span className="text-gray-700">12+ Published Papers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#258F67]" />
                  <span className="text-gray-700">27+ Patents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Beaker size={18} className="text-[#258F67]" />
                  <span className="text-gray-700">Ongoing Clinical Trials</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="section-padding bg-[#2A5A52] text-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Collaborate?</h2>
            <p className="text-white/90 max-w-3xl mx-auto mb-8">
              Let's grow wellness together. Contact our global business team to explore formulation partnerships,
              white label opportunities, and custom ingredient development.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-[#EFC368]" />
                <a href="mailto:starhi@starhiherbs.com" className="text-white hover:text-[#EFC368] transition-colors">
                  starhi@starhiherbs.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall size={20} className="text-[#EFC368]" />
                <a href="tel:+919886422452" className="text-white hover:text-[#EFC368] transition-colors">
                  +91 98864 22452
                </a>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="cta-primary">
                <Link href="/contact" className="flex items-center">
                  Contact Us
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button asChild className="bg-white text-[#2A5A52] hover:bg-[#EFC368] hover:text-[#214842]">
                <Link href="/request-quote" className="flex items-center">
                  Request a Quote
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
