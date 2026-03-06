import Image from '@/components/ui/image';
import { cn } from '@/lib/utils';
import {
  Award,
  FlaskConical,
  Leaf,
  Globe,
  Microscope,
  Settings
} from 'lucide-react';

// Feature data
const features = [
  {
    id: 1,
    title: 'Certified Quality',
    description: 'ISO, FSSC, HACCP, and GMP certified production processes',
    icon: Award,
    image: 'https://ik.imagekit.io/pon54xoks/Certified%20Quality%2001%20copy.jpg',
  },
  {
    id: 2,
    title: 'Research-Backed',
    description: 'Products supported by scientific research and clinical studies',
    icon: FlaskConical,
    image: 'https://ik.imagekit.io/pon54xoks/Research-Backed%2001.jpg',
  },
  {
    id: 3,
    title: 'Global Compliance',
    description: 'Meeting regulatory standards in 30+ countries worldwide',
    icon: Globe,
    image: 'https://ik.imagekit.io/pon54xoks/Global%20Compliance%2001.jpg',
  },
  {
    id: 4,
    title: 'Sustainable Farming',
    description: 'Ethical sourcing with regenerative agricultural practices',
    icon: Leaf,
    image: 'https://ik.imagekit.io/pon54xoks/Sustainable%20Farming%2001.jpg',
  },
  {
    id: 5,
    title: 'Advanced R&D',
    description: 'Continuous innovation through our cutting-edge labs',
    icon: Microscope,
    image: 'https://ik.imagekit.io/pon54xoks/Advanced%20R&D.jpg',
  },
  {
    id: 6,
    title: 'Customized Solutions',
    description: 'Tailored formulations to meet specific client needs',
    icon: Settings,
    image: 'https://ik.imagekit.io/pon54xoks/Customized%20Solutions%2001.jpg',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Advantage</h6>
          <h2 className="text-[#214842] mb-4">Why Choose Star Hi Herbs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what sets us apart in the global herbal extracts industry and why leading brands choose us as their trusted partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-[#214842]/10 p-3 rounded-lg mr-3">
                    <feature.icon className="h-6 w-6 text-[#214842]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#214842]">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
