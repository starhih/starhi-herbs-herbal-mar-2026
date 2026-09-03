import Image from '@/components/ui/image';
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
    iconImage: 'https://starhiherbs-herbal.sfo3.cdn.digitaloceanspaces.com/media/certified.png',
    image: 'https://ik.imagekit.io/pon54xoks/Certified%20Quality%2001%20copy.jpg',
  },
  {
    id: 2,
    title: 'Research-Backed',
    description: 'Products supported by scientific research and clinical studies',
    icon: FlaskConical,
    iconImage: 'https://starhiherbs-herbal.sfo3.cdn.digitaloceanspaces.com/media/researched-backed.png',
    image: 'https://ik.imagekit.io/pon54xoks/Research-Backed%2001.jpg',
  },
  {
    id: 3,
    title: 'Global Compliance',
    description: 'Meeting regulatory standards in 30+ countries worldwide',
    icon: Globe,
    iconImage: 'https://starhiherbs-herbal.sfo3.cdn.digitaloceanspaces.com/media/global-complaince.png',
    image: 'https://ik.imagekit.io/pon54xoks/Global%20Compliance%2001.jpg',
  },
  {
    id: 4,
    title: 'Sustainable Farming',
    description: 'Ethical sourcing with regenerative agricultural practices',
    icon: Leaf,
    iconImage: 'https://starhiherbs-herbal.sfo3.cdn.digitaloceanspaces.com/media/sustainable.png',
    image: 'https://ik.imagekit.io/pon54xoks/Sustainable%20Farming%2001.jpg',
  },
  {
    id: 5,
    title: 'Advanced R&D',
    description: 'Continuous innovation through our cutting-edge labs',
    icon: Microscope,
    iconImage: 'https://starhiherbs-herbal.sfo3.cdn.digitaloceanspaces.com/media/advanced-rnd.png',
    image: 'https://ik.imagekit.io/pon54xoks/Advanced%20R&D.jpg',
  },
  {
    id: 6,
    title: 'Customized Solutions',
    description: 'Tailored formulations to meet specific client needs',
    icon: Settings,
    iconImage: 'https://starhiherbs-herbal.sfo3.cdn.digitaloceanspaces.com/media/customized-solutions.png',
    image: 'https://ik.imagekit.io/pon54xoks/Customized%20Solutions%2001.jpg',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom relative">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Advantage</h6>
          <h2 className="text-[#214842] mb-4 text-3xl md:text-4xl font-bold">Why Choose Star Hi Herbs</h2>
          <p className="text-gray-600">
            Discover what sets us apart in the global herbal extracts industry and why leading brands choose us as their trusted partner.
          </p>
        </div>

        {/* Horizontal Scrolling Area */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory custom-scrollbar">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#258F67] flex-none w-[300px] sm:w-[340px] snap-center sm:snap-start group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {feature.iconImage ? (
                      <div className="mr-3 shrink-0">
                        <Image src={feature.iconImage} alt={feature.title} width={40} height={40} className="h-10 w-10 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                    ) : (
                      <div className="bg-[#214842]/10 p-3 rounded-lg mr-3 group-hover:bg-[#258F67]/10 transition-colors shrink-0">
                        <feature.icon className="h-6 w-6 text-[#214842] group-hover:text-[#258F67] transition-colors" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-[#214842]">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Minimal fade boundaries */}
          <div className="absolute top-0 bottom-8 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none sm:hidden"></div>
          <div className="absolute top-0 bottom-8 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:hidden"></div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}} />
    </section>
  );
}
