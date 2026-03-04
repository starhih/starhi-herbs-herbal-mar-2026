import { Metadata } from 'next';
import DownloadCatalogueForm from '@/components/forms/DownloadCatalogueForm';
import Image from '@/components/ui/image';
import { FileText, Download, BookOpen, Leaf, Award, FlaskRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download Catalogue | Star Hi Herbs',
  description: 'Download our comprehensive product catalogue featuring our herbal extracts, probiotics, and nutraceutical ingredients.',
  keywords: 'product catalogue, herbal extracts, probiotics, nutraceutical ingredients, download',
  openGraph: {
    title: 'Download Catalogue | Star Hi Herbs',
    description: 'Download our comprehensive product catalogue featuring our herbal extracts, probiotics, and nutraceutical ingredients.',
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
};

export default function DownloadCataloguePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="/images/hero/standardized-herbal-extracts.jpeg"
          alt="Download Catalogue"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="mx-auto max-w-2xl text-center">
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
            <div>
              <div className="bg-white p-8 rounded-xl shadow-md mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#214842]/10 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-[#214842]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#214842]">Our Product Catalogue</h2>
                </div>

                <p className="text-gray-600 mb-6">
                  Our comprehensive product catalogue provides detailed information about our complete range of herbal extracts,
                  probiotics, and nutraceutical ingredients. It includes:
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="bg-[#214842]/10 p-2 rounded-lg mr-3 mt-0.5">
                      <Leaf className="h-5 w-5 text-[#214842]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#214842]">Complete Product Listings</h3>
                      <p className="text-gray-600 text-sm">Detailed information on all our herbal extracts and nutraceutical ingredients.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#214842]/10 p-2 rounded-lg mr-3 mt-0.5">
                      <FlaskRound className="h-5 w-5 text-[#214842]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#214842]">Technical Specifications</h3>
                      <p className="text-gray-600 text-sm">Standardization details, active compounds, and physical properties.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#214842]/10 p-2 rounded-lg mr-3 mt-0.5">
                      <Award className="h-5 w-5 text-[#214842]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#214842]">Certifications & Compliance</h3>
                      <p className="text-gray-600 text-sm">Information on our quality standards, certifications, and regulatory compliance.</p>
                    </div>
                  </li>
                </ul>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-[#214842] mb-2">Available Formats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-[#258F67] mr-2" />
                      <span className="text-gray-600 text-sm">PDF (12.5 MB)</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-[#258F67] mr-2" />
                      <span className="text-gray-600 text-sm">Digital Flipbook</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#214842] text-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Need More Information?</h3>
                <p className="mb-4">
                  If you need specific product information or have questions about our catalogue, our team is here to help.
                </p>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@starhiherbs.com" className="hover:underline">info@starhiherbs.com</a>
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
