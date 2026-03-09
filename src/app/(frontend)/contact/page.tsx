"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock, FileText, FlaskConical, CalendarDays, ShoppingBag, ShieldCheck, Users, Download, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get form data
      const formData = new FormData(e.currentTarget);
      const formValues = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        phone: formData.get('phone') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      };

      // Import the email service dynamically to avoid SSR issues
      const { sendContactEmail } = await import('@/lib/email-service');

      // Send the email
      const result = await sendContactEmail(formValues);

      if (result.success) {
        toast({
          title: "Message Sent",
          description: "Thank you for your message. We'll get back to you soon!",
        });

        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/Contact-Us-01.jpg"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Contact Us</h1>
            <p className="text-xl text-white text-shadow-sm">
              Get in touch with our team for inquiries, support, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b mb-8">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Contact Us', href: '/contact', isCurrent: true }
            ]}
          />
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Corporate Headquarters',
                content: 'Plot #50, 3rd Road, 1st Phase\nK.I.A.D.B. Industrial Area, Jigani\nBangalore - 560105, Karnataka, India',
              },
              {
                icon: Phone,
                title: 'Call Us',
                content: '+91 98 8642 2452 (Main)\n+91 89 7179 3584 (Sales)',
              },
              {
                icon: Mail,
                title: 'Email Us',
                content: 'najish.n@starhiherbs.com (General)\nstarhi@starhiherbs.com (Sales)',
              },
              {
                icon: Clock,
                title: 'Business Hours',
                content: 'Monday - Friday: 9:30 AM - 6:00 PM (IST)\nSaturday: 9:30 AM - 3:00 PM (IST)\nSunday: Closed',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-[#214842]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-[#214842]" />
                </div>
                <h3 className="text-lg font-semibold text-[#214842] mb-2">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Sidebar */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left: Form */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-[#214842] mb-1">Send Us a Message</h2>
              <p className="text-gray-600 mb-8 text-sm">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-[#214842]">Contact Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Your company (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                {/* Your Message */}
                <div className="mb-2 mt-8">
                  <h3 className="text-lg font-semibold text-[#214842]">Your Message</h3>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="How can we help you?"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    className="min-h-[150px]"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  By submitting this form, you agree to our privacy policy. We respect your data and will never share it with third parties.
                </p>
              </form>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: FileText, title: 'Request Quote', desc: 'Get pricing for bulk orders', href: '/request-quote' },
                    { icon: FlaskConical, title: 'Request Sample', desc: 'Try before you buy', href: '/request-sample' },
                    { icon: CalendarDays, title: 'Schedule Meeting', desc: 'Meet us at trade shows', href: '/request-meeting' },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-[#214842]/10 rounded-full flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-[#214842]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#214842]">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#214842] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-[#214842] mb-5">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { icon: ShoppingBag, title: 'Browse Products', href: '/collections' },
                    { icon: ShieldCheck, title: 'Our Certifications', href: '/certifications' },
                    { icon: Users, title: 'About Us', href: '/about' },
                    { icon: Download, title: 'Download Catalog', href: '/download-catalogue' },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <item.icon className="h-4 w-4 text-[#214842]" />
                      <span className="text-sm text-gray-700 group-hover:text-[#214842] transition-colors">{item.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#214842] transition-colors ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Facilities */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Facilities</h6>
            <h2 className="text-[#214842] mb-4">Manufacturing Facilities</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                city: 'Bangalore Unit',
                country: 'Karnataka, India',
                address: '#50, 3rd Road, 1st Phase, KIADB Industrial Area\nBangalore - 560105, Karnataka, India',
                phone: '+91 98 8642 2452',
                email: 'starhi@starhiherbs.com',
              },
              {
                city: 'Hassan Unit',
                country: 'Karnataka, India',
                address: 'Plot No 105-B, Pharma SEZ KIADB Industrial Area Hassan\nHassan - 573201, Karnataka, India',
                phone: '+91 93 4257 5028',
                email: 'research@starhiherbs.com',
              },
            ].map((office, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-[#214842] mb-1">{office.city}</h3>
                <div className="text-[#258F67] font-medium mb-4">{office.country}</div>
                <div className="space-y-3 text-gray-600">
                  <p className="whitespace-pre-line">{office.address}</p>
                  <p>{office.phone}</p>
                  <p>{office.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
