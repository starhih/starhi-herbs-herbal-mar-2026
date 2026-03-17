import { Metadata } from 'next';
import Link from 'next/link';
import RequestQuoteForm from '@/components/forms/RequestQuoteForm';
import Image from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { ShieldCheck, DollarSign, Zap, HeadphonesIcon, Lightbulb, FlaskConical } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request a Quote | Star Hi Herbs',
  description: 'Request pricing information for our herbal extracts, probiotics, and nutraceutical ingredients.',
  keywords: 'quote request, pricing, herbal extracts, probiotics, nutraceutical ingredients',
  openGraph: {
    title: 'Request a Quote | Star Hi Herbs',
    description: 'Request pricing information for our herbal extracts, probiotics, and nutraceutical ingredients.',
    images: [
      {
        url: '/images/hero/standardized-herbal-extracts.jpeg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs - Request a Quote',
      },
    ],
    type: 'website',
  },
};

export default function RequestQuotePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/request-quote.jpg"
          alt="Request a Quote"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Request a Quote</h1>
            <p className="text-xl text-white text-shadow-sm">
              Fill out the form below and we will get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Sidebar Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left: Form */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <RequestQuoteForm />
            </div>

            {/* Right: Info Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-8">
              {/* Why Choose Star Hi Herbs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">Why Choose Star Hi Herbs</h3>
                <div className="space-y-5">
                  {[
                    { icon: ShieldCheck, title: 'Quality Assurance', desc: 'All products undergo rigorous testing to ensure they meet the highest quality standards with full traceability.' },
                    { icon: DollarSign, title: 'Competitive Pricing', desc: 'Direct manufacturer pricing with flexible MOQs and volume discounts for bulk orders.' },
                    { icon: Zap, title: 'Fast Response', desc: 'Receive detailed quotes within 24 hours with pricing, lead times, and product specifications.' },
                    { icon: HeadphonesIcon, title: 'Expert Support', desc: 'Technical guidance from our team to help you select the right products for your formulations.' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 bg-[#214842]/10 rounded-full flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-[#214842]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#214842]">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Process */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">Quote Process</h3>
                <div className="relative">
                  <div className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-[#214842]/15"></div>
                  {[
                    'Submit your quote request with product details and quantity requirements',
                    'Our team reviews your request and prepares a detailed quotation',
                    'Receive your quote within 24 hours via email',
                    'Discuss any modifications or clarifications with our sales team',
                    'Confirm your order and receive proforma invoice',
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3 mb-4 last:mb-0">
                      <div className="relative z-10 flex-shrink-0 w-7 h-7 bg-[#214842] text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <p className="text-xs text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Tip */}
                <div className="mt-5 bg-[#214842]/5 border border-[#214842]/15 rounded-lg p-3 flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-[#258F67] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Quick Tip:</span> Include specific standardization requirements and target specifications for faster quote processing.
                  </p>
                </div>
              </div>

              {/* Need Samples First? */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <FlaskConical className="h-8 w-8 text-[#258F67] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[#214842] mb-2">Need Samples First?</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Want to evaluate our products before requesting a quote? We offer samples for R&D and quality testing.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-5 text-xs text-gray-700">
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">25-50g sample sizes</span>
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">COA included</span>
                  <span className="bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Technical support</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" className="bg-[#214842] hover:bg-[#1a3a35] text-white w-full">
                    <Link href="/request-sample">Request Sample</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842]/5 w-full">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
