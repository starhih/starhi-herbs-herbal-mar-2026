import Link from 'next/link';
import Image from '@/components/ui/image';
import { Facebook, Instagram, Linkedin, Mail, PhoneCall, MapPin, Twitter, Youtube } from 'lucide-react';
import { navCategories } from '@/data/nav-categories';
import { getPayloadClient } from '@/lib/payload';

interface FooterProps {
  categories?: Array<{ name: string; slug: string }>;
}

export default async function Footer({ categories }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();
  let productCategories = categories && categories.length > 0 ? categories : [];

  let settings: any = null;
  try {
    const payload = await getPayloadClient();
    settings = await (payload as any).findGlobal({ slug: 'site-settings' });
    if (productCategories.length === 0) {
      const { docs } = await payload.find({ collection: 'categories', limit: 100 });
      if (docs && docs.length > 0) {
        productCategories = docs.map((c) => ({ name: c.name, slug: c.slug }));
      }
    }
  } catch {
    // Fallback to defaults if settings or categories not yet loaded
  }

  if (productCategories.length === 0) {
    productCategories = navCategories;
  }

  const tagline = settings?.general?.tagline || 'Global manufacturer of premium herbal extracts, probiotics, and nutraceutical solutions for a healthier tomorrow.';
  const copyrightText = settings?.general?.copyrightText || 'Star Hi Herbs Pvt Ltd. All rights reserved.';
  const address = settings?.contact?.address || 'Plot #50, 3rd Road, 1st Phase\nK.I.A.D.B. Industrial Area, Jigani\nBangalore - 560105, Karnataka, India';
  const phone = settings?.contact?.phone || '+91 98 8642 2452';
  const email = settings?.contact?.email || 'starhi@starhiherbs.com';
  const linkedinUrl = settings?.social?.linkedin || 'https://in.linkedin.com/company/star-hi-herbs-pvt-ltd';
  const facebookUrl = settings?.social?.facebook || 'https://www.facebook.com/StarHiHerbsNaturalExtracts/';
  const instagramUrl = settings?.social?.instagram || 'https://www.instagram.com/star.hi.herbs/';
  const twitterUrl = settings?.social?.twitter || '';
  const youtubeUrl = settings?.social?.youtube || '';

  return (
    <footer className="bg-[#214842] text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-5 -ml-3">
              <Image src="https://ik.imagekit.io/pon54xoks/starhi-herbs%20-white-02.svg?updatedAt=1770631428126"
                alt="Star Hi Herbs"
                width={280}
                height={70}
                className="object-contain"
                style={{ maxHeight: '75px', mixBlendMode: 'screen' }}
                priority
              />
            </div>
            <p className="mb-6 text-white/80 text-sm leading-relaxed">
              {tagline}
            </p>
            <div className="flex space-x-4">
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#EFC368] transition-colors" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#EFC368] transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#EFC368] transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#EFC368] transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#EFC368] transition-colors" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="footer-link">About Us</Link>
              </li>
              <li>
                <Link href="/products" className="footer-link">Products</Link>
              </li>
              <li>
                <Link href="/innovation" className="footer-link">Innovation</Link>
              </li>
              <li>
                <Link href="/sustainability" className="footer-link">Sustainability</Link>
              </li>
              <li>
                <Link href="/blog" className="footer-link">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/request-quote" className="footer-link">Request Quote</Link>
              </li>
              <li>
                <Link href="/request-sample" className="footer-link">Request Sample</Link>
              </li>
              <li>
                <Link href="/download-catalogue" className="footer-link">Download Catalogue</Link>
              </li>
              <li>
                <Link href="/request-meeting" className="footer-link">Request Meeting</Link>
              </li>
              <li>
                <Link href="/careers" className="footer-link">Careers</Link>
              </li>
              <li>
                <Link href="/certifications" className="footer-link">Certifications</Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              {productCategories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/collections/${category.slug}`} className="footer-link">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#EFC368] mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm">
                  {address.split('\n').map((line: string, i: number) => (
                    <span key={i}>{line}{i < address.split('\n').length - 1 && <br />}</span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall size={20} className="text-[#EFC368] flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-white/80 hover:text-white text-sm">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#EFC368] flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-white/80 hover:text-white text-sm break-all">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            &copy; {currentYear} {copyrightText}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
