import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Eye, Lock, Users, FileText, Mail, Phone } from 'lucide-react';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | Star Hi Herbs',
  description: 'Read Star Hi Herbs\' privacy policy to understand how we collect, use, and protect your personal information when you visit our website or use our services.',
  keywords: 'privacy policy, data protection, personal information, Star Hi Herbs, GDPR, data security',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Star Hi Herbs',
    description: 'Read Star Hi Herbs\' privacy policy to understand how we collect, use, and protect your personal information when you visit our website or use our services.',
    url: '/privacy-policy',
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
    title: 'Privacy Policy | Star Hi Herbs',
    description: 'Read Star Hi Herbs\' privacy policy to understand how we collect, use, and protect your personal information when you visit our website or use our services.',
    images: ['https://ik.imagekit.io/pon54xoks/website.jpg'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#214842] text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-full">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/90">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Privacy Policy', href: '/privacy-policy', isCurrent: true }
            ]}
          />
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> January 1, 2025
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This Privacy Policy explains how Star Hi Herbs Pvt Ltd ("we," "us," or "our") collects, uses, and protects your information when you visit our website or use our services.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-white border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#214842] mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Table of Contents
              </h2>
              <nav className="space-y-2">
                <a href="#information-collection" className="block text-[#258F67] hover:text-[#214842] transition-colors">1. Information We Collect</a>
                <a href="#information-use" className="block text-[#258F67] hover:text-[#214842] transition-colors">2. How We Use Your Information</a>
                <a href="#information-sharing" className="block text-[#258F67] hover:text-[#214842] transition-colors">3. Information Sharing</a>
                <a href="#cookies" className="block text-[#258F67] hover:text-[#214842] transition-colors">4. Cookies and Tracking</a>
                <a href="#data-security" className="block text-[#258F67] hover:text-[#214842] transition-colors">5. Data Security</a>
                <a href="#user-rights" className="block text-[#258F67] hover:text-[#214842] transition-colors">6. Your Rights</a>
                <a href="#third-party" className="block text-[#258F67] hover:text-[#214842] transition-colors">7. Third-Party Services</a>
                <a href="#data-retention" className="block text-[#258F67] hover:text-[#214842] transition-colors">8. Data Retention</a>
                <a href="#international-transfers" className="block text-[#258F67] hover:text-[#214842] transition-colors">9. International Data Transfers</a>
                <a href="#children" className="block text-[#258F67] hover:text-[#214842] transition-colors">10. Children's Privacy</a>
                <a href="#changes" className="block text-[#258F67] hover:text-[#214842] transition-colors">11. Policy Changes</a>
                <a href="#contact" className="block text-[#258F67] hover:text-[#214842] transition-colors">12. Contact Information</a>
              </nav>
            </div>

            {/* Content Sections */}
            <div className="prose prose-lg max-w-none">
              {/* Information Collection */}
              <section id="information-collection" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6 flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-[#258F67]" />
                  1. Information We Collect
                </h2>
                
                <h3 className="text-xl font-medium text-[#214842] mb-4">Personal Information</h3>
                <p className="text-gray-600 mb-4">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Fill out contact forms or request quotes</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Register for events or webinars</li>
                  <li>Download our product catalogs or technical documents</li>
                  <li>Apply for career opportunities</li>
                  <li>Communicate with us via email or phone</li>
                </ul>

                <h3 className="text-xl font-medium text-[#214842] mb-4">Automatically Collected Information</h3>
                <p className="text-gray-600 mb-4">
                  When you visit our website, we automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website</li>
                  <li>Device information</li>
                </ul>
              </section>

              {/* Information Use */}
              <section id="information-use" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-[#258F67]" />
                  2. How We Use Your Information
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To process quote requests and business communications</li>
                  <li>To send you marketing materials and product updates (with your consent)</li>
                  <li>To improve our website and services</li>
                  <li>To analyze website usage and performance</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section id="information-sharing" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">3. Information Sharing</h2>
                
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>With service providers who assist us in operating our website and business</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">4. Cookies and Tracking</h2>
                
                <p className="text-gray-600 mb-4">
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience. We use:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> To understand how visitors use our site</li>
                  <li><strong>Marketing Cookies:</strong> To deliver relevant advertisements</li>
                  <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
                </p>
              </section>

              {/* Data Security */}
              <section id="data-security" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6 flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-[#258F67]" />
                  5. Data Security
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              {/* User Rights */}
              <section id="user-rights" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">6. Your Rights</h2>

                <p className="text-gray-600 mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Right to access your personal data</li>
                  <li>Right to rectify inaccurate information</li>
                  <li>Right to erase your personal data</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  To exercise these rights, please contact us using the information provided in the Contact section below.
                </p>
              </section>

              {/* Third-Party Services */}
              <section id="third-party" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">7. Third-Party Services</h2>

                <p className="text-gray-600 mb-4">
                  Our website may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services. We recommend reviewing their privacy policies before providing any personal information.
                </p>
                <p className="text-gray-600 mb-6">
                  Third-party services we may use include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Google Analytics for website analytics</li>
                  <li>Email marketing platforms</li>
                  <li>Social media platforms</li>
                  <li>Customer support tools</li>
                </ul>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">8. Data Retention</h2>

                <p className="text-gray-600 mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. Factors that determine retention periods include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>The nature of the information collected</li>
                  <li>Legal and regulatory requirements</li>
                  <li>Business needs and purposes</li>
                  <li>Your consent and preferences</li>
                </ul>
              </section>

              {/* International Transfers */}
              <section id="international-transfers" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">9. International Data Transfers</h2>

                <p className="text-gray-600 mb-4">
                  As a global company, we may transfer your personal information to countries outside your jurisdiction. When we do so, we ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">10. Children's Privacy</h2>

                <p className="text-gray-600 mb-4">
                  Our website and services are not directed to children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information.
                </p>
              </section>

              {/* Policy Changes */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">11. Policy Changes</h2>

                <p className="text-gray-600 mb-4">
                  We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              {/* Contact Information */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#214842] mb-6">12. Contact Information</h2>

                <p className="text-gray-600 mb-4">
                  If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-[#214842] mb-3">Star Hi Herbs Pvt Ltd</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Address:</strong> Hassan SEZ, Karnataka, India</p>
                    <p><strong>Email:</strong> <a href="mailto:privacy@starhiherbs.com" className="text-[#258F67] hover:text-[#214842]">privacy@starhiherbs.com</a></p>
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
            <h2 className="text-2xl font-semibold text-[#214842] mb-4">Questions About Our Privacy Policy?</h2>
            <p className="text-gray-600 mb-8">
              If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-[#258F67]" />
                <a href="mailto:privacy@starhiherbs.com" className="text-[#214842] hover:text-[#258F67] transition-colors">
                  privacy@starhiherbs.com
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
