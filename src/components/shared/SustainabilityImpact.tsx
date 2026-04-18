import Image from '@/components/ui/image';
import { Leaf, Recycle, Users, Globe } from 'lucide-react';

export default function SustainabilityImpact() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Impact</h6>
          <h2 className="text-[#214842] mb-4">Key Initiatives</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Leaf,
              title: 'Organic Farming',
              description: 'Supporting over 1,000 farmers in transitioning to organic practices.',
              stat: '5,000+ acres',
              label: 'Organic Farmland',
              image: 'https://ik.imagekit.io/pon54xoks/organic%20Farming%20%2001.jpg',
            },
            {
              icon: Recycle,
              title: 'Zero Waste',
              description: 'Implementing circular economy principles in our operations.',
              stat: '95%',
              label: 'Waste Recycled',
              image: 'https://ik.imagekit.io/pon54xoks/Zero-Waste-01.jpg',
            },
            {
              icon: Users,
              title: 'Community Support',
              description: 'Empowering local communities through education and employment.',
              stat: '2,000+',
              label: 'Farmers Trained',
              image: 'https://ik.imagekit.io/pon54xoks/Community%20Support%2001.jpg',
            },
            {
              icon: Globe,
              title: 'Carbon Neutral',
              description: 'Working towards carbon neutrality across our operations.',
              stat: '-40%',
              label: 'Carbon Reduction',
              image: 'https://ik.imagekit.io/pon54xoks/Carbon-Neutral-01.jpeg.jpg',
            },
          ].map((initiative, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                <Image src={initiative.image} alt={initiative.title} fill className="object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="bg-[#214842]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mt-[-40px] relative z-10 bg-white border-4 border-white shadow-sm">
                  <initiative.icon className="h-6 w-6 text-[#214842]" />
                </div>
                <h3 className="text-lg font-semibold text-[#214842] mb-2">{initiative.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">{initiative.description}</p>
                <div className="border-t pt-4">
                  <div className="text-2xl font-bold text-[#258F67]">{initiative.stat}</div>
                  <div className="text-sm text-gray-600">{initiative.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
