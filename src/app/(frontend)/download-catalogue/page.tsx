import { Metadata } from 'next';
import DownloadCatalogueForm from '@/components/forms/DownloadCatalogueForm';
import Image from '@/components/ui/image';
import { FileText, Download, BookOpen, Leaf, Award, FlaskRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download Catalogue | Star Hi Herbs',
  description: 'Download our comprehensive product catalogue featuring our herbal extracts, probiotics, and nutraceutical ingredients.',
  keywords: 'product catalogue, herbal extracts, probiotics, nutraceutical ingredients, download',
  alternates: {
    canonical: '/download-catalogue',
  },
  openGraph: {
    title: 'Download Catalogue | Star Hi Herbs',
    description: 'Download our comprehensive product catalogue featuring our herbal extracts, probiotics, and nutraceutical ingredients.',
    url: '/download-catalogue',
    images: [
      {
        url: '/images/hero/standardized-herbal-extracts.jpeg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs - Download Catalogue',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download Catalogue | Star Hi Herbs',
    description: 'Download our comprehensive product catalogue featuring our herbal extracts, probiotics, and nutraceutical ingredients.',
    images: ['/images/hero/standardized-herbal-extracts.jpeg'],
  },
};

export default function DownloadCataloguePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/download-catalog.jpg"
          alt="Download Catalogue"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Download Our Catalogue</h1>
            <p className="text-xl text-white text-shadow-sm">
              Access our comprehensive product catalogue featuring our complete range of herbal extracts and nutraceutical ingredients.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Catalogue Info */}
            <div className="flex flex-col h-full">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 mb-8 flex-grow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#214842]/10 p-4 rounded-xl">
                    <BookOpen className="h-8 w-8 text-[#214842]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#214842] mb-0 tracking-tight">Our Product Catalogue</h2>
                </div>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Our comprehensive product catalogue provides detailed information about our complete range of herbal extracts,
                  probiotics, and nutraceutical ingredients. It includes:
                </p>

                <ul className="space-y-8 mb-10">
                  <li className="flex items-start">
                    <div className="bg-[#214842]/10 p-3 rounded-xl mr-4 flex-shrink-0">
                      <Leaf className="h-6 w-6 text-[#214842]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#214842] mb-2 tracking-tight">Complete Product Listings</h3>
                      <p className="text-gray-600 text-base leading-relaxed">Detailed information on all our herbal extracts and nutraceutical ingredients.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#214842]/10 p-3 rounded-xl mr-4 flex-shrink-0">
                      <FlaskRound className="h-6 w-6 text-[#214842]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#214842] mb-2 tracking-tight">Technical Specifications</h3>
                      <p className="text-gray-600 text-base leading-relaxed">Standardization details, active compounds, and physical properties.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#214842]/10 p-3 rounded-xl mr-4 flex-shrink-0">
                      <Award className="h-6 w-6 text-[#214842]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#214842] mb-2 tracking-tight">Certifications & Compliance</h3>
                      <p className="text-gray-600 text-base leading-relaxed">Information on our quality standards, certifications, and regulatory compliance.</p>
                    </div>
                  </li>
                </ul>

 
              </div>

              <div className="bg-gradient-to-br from-[#214842] to-[#122A26] text-white p-8 md:p-10 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Need More Information?</h3>
                <p className="mb-6 text-gray-200 text-lg leading-relaxed">
                  If you need specific product information or have questions about our catalogue, our technical team is ready to assist you.
                </p>
                <div className="flex items-center text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#258F67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:starhi@starhiherbs.com" className="hover:text-[#258F67] transition-colors font-medium">starhi@starhiherbs.com</a>
                </div>
              </div>
            </div>

            {/* Right Column - Download Form */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#214842]/10 p-3 rounded-full">
                  <Download className="h-6 w-6 text-[#214842]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#214842]">Download Now</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Please fill out the form below to download our product catalogue. Your information helps us
                understand your needs better and provide you with relevant updates.
              </p>

              <DownloadCatalogueForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
