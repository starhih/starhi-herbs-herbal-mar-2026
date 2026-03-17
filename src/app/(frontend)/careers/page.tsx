import Image from '@/components/ui/image';
import { getPayloadClient } from '@/lib/payload';
import { mapJob } from '@/lib/mappers';
import CareersPageClient from '@/components/careers/CareersPageClient';

export default async function CareersPage() {
  const payload = await getPayloadClient();

  // Fetch active jobs from Payload
  const { docs: jobDocs } = await payload.find({
    collection: 'jobs',
    where: { isActive: { equals: true } },
    limit: 100,
  });
  const jobOpenings = jobDocs.map(mapJob).filter(Boolean);

  // Get unique departments
  const uniqueDepartments = Array.from(new Set(jobOpenings.map((job: any) => job.department)));
  const departments = ['all', ...uniqueDepartments];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/career.jpg"
          alt="Careers at Star Hi Herbs"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Join Our Team</h1>
            <p className="text-xl text-white text-shadow-sm">
              Discover rewarding career opportunities at Star Hi Herbs, where innovation meets tradition in herbal extract manufacturing.
            </p>
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Culture</h6>
              <h2 className="text-[#214842] mb-4">Why Work With Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  At Star Hi Herbs, we're passionate about harnessing nature's power to create innovative, high-quality herbal extracts that improve lives worldwide. Our team combines scientific expertise with a deep respect for traditional knowledge.
                </p>
                <p>
                  We foster a collaborative environment where creativity, continuous learning, and personal growth are encouraged. Our employees enjoy a supportive workplace culture that values work-life balance, diversity, and sustainability.
                </p>
                <p>
                  Join us to be part of a company that's making a positive impact on global health while providing opportunities for professional development and advancement.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                alt="Star Hi Herbs Team Culture"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Employee Benefits</h6>
            <h2 className="text-[#214842] mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in taking care of our team members with comprehensive benefits and a supportive work environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Health & Wellness',
                description: 'Comprehensive health insurance, wellness programs, and fitness allowances to keep you at your best.',
                icon: '🏥'
              },
              {
                title: 'Professional Growth',
                description: 'Continuous learning opportunities, conference attendance, and career advancement pathways.',
                icon: '📈'
              },
              {
                title: 'Work-Life Balance',
                description: 'Flexible scheduling options, paid time off, and family-friendly policies.',
                icon: '⏱️'
              },
              {
                title: 'Financial Benefits',
                description: 'Competitive compensation, retirement plans, and performance bonuses.',
                icon: '💰'
              },
              {
                title: 'Collaborative Environment',
                description: 'Team-building activities, open communication, and a supportive workplace culture.',
                icon: '🤝'
              },
              {
                title: 'Global Exposure',
                description: 'Opportunities to work with international clients and attend global industry events.',
                icon: '🌎'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-[#214842] mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings and Application Sections */}
      <CareersPageClient departments={departments} jobOpenings={jobOpenings} />
    </>
  );
}
