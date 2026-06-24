import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Scale, AlertTriangle, Shield, Globe, Mail, Phone } from 'lucide-react';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Star Hi Herbs',
  description: 'Review Star Hi Herbs\' terms and conditions governing the use of our website, products, and services. Learn about user responsibilities and limitations.',
  keywords: 'terms and conditions, terms of use, legal, Star Hi Herbs, website terms, service agreement',
  alternates: {
    canonical: '/terms-conditions',
  },
  openGraph: {
    title: 'Terms & Conditions | Star Hi Herbs',
    description: 'Review Star Hi Herbs\' terms and conditions governing the use of our website, products, and services. Learn about user responsibilities and limitations.',
    url: '/terms-conditions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | Star Hi Herbs',
    description: 'Review Star Hi Herbs\' terms and conditions governing the use of our website, products, and services. Learn about user responsibilities and limitations.',
  },
};

export default function TermsConditionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#214842] text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-full">
                <Scale className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="mb-4">Terms & Conditions</h1>
            <p className="text-xl text-white/90">
              Please read these terms and conditions carefully before using our website or services.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Terms & Conditions', href: '/terms-conditions', isCurrent: true }
            ]}
          />
        </div>
      </section>

      {/* Terms & Conditions Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> January 1, 2025
              </p>
              <p className="text-sm text-gray-600 mt-2">
                These Terms and Conditions ("Terms") govern your use of the Star Hi Herbs Pvt Ltd website and services. By accessing or using our website, you agree to be bound by these Terms.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-white border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Table of Contents
              </h2>
              <nav className="space-y-2">
                <a href="#acceptance" className="block text-[#258F67] hover:text-[#214842] transition-colors">1. Acceptance of Terms</a>
                <a href="#website-use" className="block text-[#258F67] hover:text-[#214842] transition-colors">2. Website Use</a>
                <a href="#products-services" className="block text-[#258F67] hover:text-[#214842] transition-colors">3. Products and Services</a>
                <a href="#intellectual-property" className="block text-[#258F67] hover:text-[#214842] transition-colors">4. Intellectual Property</a>
                <a href="#user-conduct" className="block text-[#258F67] hover:text-[#214842] transition-colors">5. User Conduct</a>
                <a href="#disclaimers" className="block text-[#258F67] hover:text-[#214842] transition-colors">6. Disclaimers</a>
                <a href="#limitation-liability" className="block text-[#258F67] hover:text-[#214842] transition-colors">7. Limitation of Liability</a>
                <a href="#indemnification" className="block text-[#258F67] hover:text-[#214842] transition-colors">8. Indemnification</a>
                <a href="#termination" className="block text-[#258F67] hover:text-[#214842] transition-colors">9. Termination</a>
                <a href="#governing-law" className="block text-[#258F67] hover:text-[#214842] transition-colors">10. Governing Law</a>
                <a href="#changes" className="block text-[#258F67] hover:text-[#214842] transition-colors">11. Changes to Terms</a>
                <a href="#contact" className="block text-[#258F67] hover:text-[#214842] transition-colors">12. Contact Information</a>
              </nav>
            </div>

            {/* Content Sections */}
            <div className="prose prose-lg max-w-none">
              {/* Acceptance of Terms */}
              <section id="acceptance" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-[#258F67]" />
                  1. Acceptance of Terms
                </h2>
                
                <p className="text-gray-600 mb-4">
                  By accessing and using the Star Hi Herbs website (www.starhiherbs.com), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-600 mb-6">
                  These Terms apply to all visitors, users, and others who access or use our website and services.
                </p>
              </section>

              {/* Website Use */}
              <section id="website-use" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6 flex items-center">
                  <Globe className="h-6 w-6 mr-3 text-[#258F67]" />
                  2. Website Use
                </h2>
                
                <h3 className="text-xl font-medium text-[#214842] mb-4">Permitted Use</h3>
                <p className="text-gray-600 mb-4">
                  You may use our website for lawful purposes only. You agree to use the website in a manner consistent with any and all applicable laws and regulations.
                </p>

                <h3 className="text-xl font-medium text-[#214842] mb-4">Prohibited Activities</h3>
                <p className="text-gray-600 mb-4">
                  You may not use our website to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Transmit any unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable content</li>
                  <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
                  <li>Interfere with or disrupt the website or servers or networks connected to the website</li>
                  <li>Attempt to gain unauthorized access to any portion of the website</li>
                  <li>Use any automated means to access the website for any purpose without our express written permission</li>
                </ul>
              </section>

              {/* Products and Services */}
              <section id="products-services" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">3. Products and Services</h2>
                
                <h3 className="text-xl font-medium text-[#214842] mb-4">Product Information</h3>
                <p className="text-gray-600 mb-4">
                  We strive to provide accurate product information on our website. However, we do not warrant that product descriptions, specifications, or other content is accurate, complete, reliable, current, or error-free.
                </p>

                <h3 className="text-xl font-medium text-[#214842] mb-4">Business-to-Business Services</h3>
                <p className="text-gray-600 mb-4">
                  Our products and services are intended for business-to-business transactions. We do not sell directly to consumers. All inquiries and orders are subject to our approval and acceptance.
                </p>

                <h3 className="text-xl font-medium text-[#214842] mb-4">Quality and Compliance</h3>
                <p className="text-gray-600 mb-6">
                  While we maintain high quality standards and certifications, customers are responsible for ensuring our products meet their specific requirements and comply with applicable regulations in their jurisdiction.
                </p>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual-property" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">4. Intellectual Property</h2>
                
                <p className="text-gray-600 mb-4">
                  The content on this website, including but not limited to text, graphics, images, logos, button icons, software, and their compilation, is the property of Star Hi Herbs Pvt Ltd or its content suppliers and is protected by Indian and international copyright laws.
                </p>
                <p className="text-gray-600 mb-4">
                  You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, translate, modify, reverse-engineer, disassemble, decompile, or otherwise exploit this website or any portion of it unless expressly permitted by Star Hi Herbs Pvt Ltd in writing.
                </p>
                <p className="text-gray-600 mb-6">
                  All trademarks, service marks, and trade names used on this website are trademarks or registered trademarks of Star Hi Herbs Pvt Ltd or their respective owners.
                </p>
              </section>

              {/* User Conduct */}
              <section id="user-conduct" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">5. User Conduct</h2>
                
                <p className="text-gray-600 mb-4">
                  You are responsible for your conduct while using our website and services. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                  <li>Provide accurate and complete information when requested</li>
                  <li>Maintain the confidentiality of any account credentials</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  We reserve the right to terminate or suspend access to our website for any user who violates these Terms.
                </p>
              </section>

              {/* Disclaimers */}
              <section id="disclaimers" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3 text-[#258F67]" />
                  6. Disclaimers
                </h2>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <p className="text-yellow-800 font-medium">
                    Important: Please read this section carefully as it limits our liability.
                  </p>
                </div>

                <p className="text-gray-600 mb-4">
                  THE INFORMATION ON THIS WEBSITE IS PROVIDED ON AN "AS IS" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, STAR HI HERBS PVT LTD:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>EXCLUDES ALL REPRESENTATIONS AND WARRANTIES RELATING TO THIS WEBSITE AND ITS CONTENTS</li>
                  <li>EXCLUDES ALL LIABILITY FOR DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THIS WEBSITE</li>
                  <li>DOES NOT WARRANT THAT THE WEBSITE WILL BE CONSTANTLY AVAILABLE OR AVAILABLE AT ALL</li>
                  <li>DOES NOT WARRANT THAT THE INFORMATION ON THIS WEBSITE IS COMPLETE, TRUE, ACCURATE, OR NON-MISLEADING</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section id="limitation-liability" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">7. Limitation of Liability</h2>

                <p className="text-gray-600 mb-4">
                  IN NO EVENT SHALL STAR HI HERBS PVT LTD, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE WEBSITE OR SERVICES.
                </p>
                <p className="text-gray-600 mb-6">
                  This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if we have been advised of the possibility of such damage.
                </p>
              </section>

              {/* Indemnification */}
              <section id="indemnification" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">8. Indemnification</h2>

                <p className="text-gray-600 mb-4">
                  You agree to indemnify, defend, and hold harmless Star Hi Herbs Pvt Ltd, its officers, directors, employees, agents, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Your violation of these Terms</li>
                  <li>Your use of the website or services</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Your violation of any applicable laws or regulations</li>
                </ul>
              </section>

              {/* Termination */}
              <section id="termination" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">9. Termination</h2>

                <p className="text-gray-600 mb-4">
                  We may terminate or suspend your access to our website and services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="text-gray-600 mb-6">
                  Upon termination, your right to use the website will cease immediately. All provisions of the Terms which by their nature should survive termination shall survive termination.
                </p>
              </section>

              {/* Governing Law */}
              <section id="governing-law" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">10. Governing Law</h2>

                <p className="text-gray-600 mb-4">
                  These Terms shall be interpreted and governed by the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
                </p>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">11. Changes to Terms</h2>

                <p className="text-gray-600 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-gray-600 mb-6">
                  Your continued use of the website after any such changes constitutes your acceptance of the new Terms.
                </p>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">12. Contact Information</h2>

                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-[#214842] mb-3">Star Hi Herbs Pvt Ltd</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Address:</strong> Hassan SEZ, Karnataka, India</p>
                    <p><strong>Email:</strong> <a href="mailto:legal@starhiherbs.com" className="text-[#258F67] hover:text-[#214842]">legal@starhiherbs.com</a></p>
                    <p><strong>Phone:</strong> <a href="tel:+919886422452" className="text-[#258F67] hover:text-[#214842]">+91 98864 22452</a></p>
                    <p><strong>Website:</strong> <a href="https://starhiherbs.com" className="text-[#258F67] hover:text-[#214842]">www.starhiherbs.com</a></p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-[#214842] mb-4">Questions About Our Terms?</h2>
            <p className="text-gray-600 mb-8">
              If you have any questions about these Terms and Conditions, please contact our legal team.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-[#258F67]" />
                <a href="mailto:legal@starhiherbs.com" className="text-[#214842] hover:text-[#258F67] transition-colors">
                  legal@starhiherbs.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-[#258F67]" />
                <a href="tel:+919886422452" className="text-[#214842] hover:text-[#258F67] transition-colors">
                  +91 98864 22452
                </a>
              </div>
            </div>
            <Button asChild className="cta-primary">
              <Link href="/contact" className="flex items-center">
                Contact Us
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
