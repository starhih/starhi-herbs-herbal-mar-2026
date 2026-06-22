import Image from '@/components/ui/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FlaskRound as Flask, Microscope, Lightbulb, Award } from 'lucide-react';

export default function InnovationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/innovation-research.jpg"
          alt="Research and Development"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Innovation & Research</h1>
            <p className="text-xl text-white text-shadow-sm">
              Advancing herbal science through cutting-edge research and development.
            </p>
          </div>
        </div>
      </section>

      {/* R&D Excellence */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our R&D Excellence</h6>
              <h2 className="text-[#214842] mb-6">Research & Development at Star Hi Herbs</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  At Star Hi Herbs, research and development is at the core of our innovation strategy. Our DSIR-recognized R&D laboratory,
                  established in 2018, combines traditional herbal knowledge with cutting-edge scientific methods to develop standardized,
                  efficacious, and safe botanical extracts.
                </p>
                <p>
                  Our team of experienced scientists, led by Dr. Sadashiv, has contributed 27+ international publications and filed 41+ patents
                  in the field of herbal extracts and their applications. We continuously invest in advanced analytical equipment and methodology
                  development to enhance our capabilities.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-lg font-semibold text-[#214842] mb-2">DSIR Recognition</h3>
                <p className="text-gray-600 text-sm">Government certified R&D center</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-lg font-semibold text-[#214842] mb-2">27+ publications</h3>
                <p className="text-gray-600 text-sm">In international journals</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-lg font-semibold text-[#214842] mb-2">41+ patents</h3>
                <p className="text-gray-600 text-sm">Filed for novel formulations</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Microscope className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-lg font-semibold text-[#214842] mb-2">Star Hi Herbs R&D Lab</h3>
                <p className="text-gray-600 text-sm">State-of-the-art facilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Focus Areas */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Research Focus Areas</h6>
            <h2 className="text-[#214842] mb-4">Our R&D Initiatives</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our R&D initiatives focus on developing innovative, efficacious, and scientifically-validated extracts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Microscope className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Clinical Studies</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Coleus Forskohlii extract for obesity and liver health</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Boswellia extract for osteoarthritis management</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Lutein & Zeaxanthin for eye health and vision support</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Turmeric formulations for inflammatory conditions</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Flask className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Bioavailability Enhancement</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Development of phospholipid complexes for improved absorption</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Water dispersible technologies for lipophilic compounds</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Novel delivery systems for herbal actives</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Stability enhancement for sensitive phytochemicals</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Microscope className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Analytical Method Development</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Validated HPLC methods for active compound quantification</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Fingerprinting techniques for botanical identification</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Stability-indicating assays for shelf-life determination</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Advanced spectroscopic methods for structure elucidation</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Product Innovation</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Branded ingredient development with clinical substantiation</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Multi-herb formulations for synergistic benefits</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Organic and clean-label extract development</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span>Specialized applications for functional foods & beverages</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* Laboratory Infrastructure */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Laboratory Infrastructure</h6>
            <h2 className="text-[#214842] mb-4">State-of-the-art Equipment and Facilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              State-of-the-art equipment and facilities supporting our research and quality control
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Flask,
                title: 'High Performance Liquid Chromatography (HPLC)',
                description: 'For precise quantification of active compounds and impurities',
                image: 'https://ik.imagekit.io/pon54xoks/hplc-lab-.jpg',
              },
              {
                icon: Flask,
                title: 'Gas Chromatography (GC)',
                description: 'Analysis of volatile compounds and essential oils',
                image: 'https://ik.imagekit.io/pon54xoks/GC%20Equipment.jpg',
              },
              {
                icon: Flask,
                title: 'UV Spectrophotometry',
                description: 'Rapid screening and quantification of active constituents',
                image: 'https://ik.imagekit.io/pon54xoks/UV%20Spectrophotometry.jpeg',
              },
              {
                icon: Microscope,
                title: 'LC-MS-MS',
                description: 'Advanced structural identification and trace analysis',
                image: 'https://ik.imagekit.io/pon54xoks/LC%20MS%20-MS%2001.jpg',
              },
              {
                icon: Microscope,
                title: 'Microbiology Testing Lab',
                description: 'For quality and safety testing of probiotic products',
                image: 'https://ik.imagekit.io/pon54xoks/microbiology.jpg',
              },
              {
                icon: Flask,
                title: 'Stability Chambers',
                description: 'Long-term and accelerated stability testing under controlled conditions',
                image: 'https://ik.imagekit.io/pon54xoks/stability-chambers.jpg',
              },
            ].map((equipment, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                  <Image src={equipment.image} alt={equipment.title} fill className="object-cover" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 mt-[-56px] relative z-10 bg-white border-4 border-white shadow-sm">
                    <equipment.icon className="h-7 w-7 text-[#214842]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#214842] mb-3">{equipment.title}</h3>
                  <p className="text-gray-600 flex-1">{equipment.description}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Quality Assurance */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Quality Assurance</h6>
            <h2 className="text-[#214842] mb-4">Ensuring Product Excellence</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive quality assurance protocols ensure consistent, safe, and effective products
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Supplier Qualification Framework</h3>
              <p className="text-gray-600 mb-4">
                Current FDA 21 CFR 111 regulations mandate a four-tier supplier verification process:
              </p>
              <ol className="space-y-4 text-gray-600 list-decimal pl-5">
                <li>
                  <span className="font-medium text-[#214842]">Documentary Audit</span>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Certification validity (ISO 9001, USDA Organic)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Batch-specific COAs with HPLC chromatograms</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium text-[#214842]">Physical Authentication</span>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Macroscopic/microscopic botanical verification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>DNA barcoding for species confirmation</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium text-[#214842]">Performance Validation</span>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Three consecutive batch analyses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Accelerated stability testing (40°C/75% RH for 6 months)</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium text-[#214842]">Continuous Monitoring</span>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Quarterly bioactive content audits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Annual onsite GMP inspections</span>
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Viability Verification Protocols</h3>
              <p className="text-gray-600 mb-4">
                Current GMP standards mandate three-tier viability testing:
              </p>
              <ol className="space-y-4 text-gray-600 list-decimal pl-5">
                <li>
                  <span className="font-medium text-[#214842]">Plate Count Validation</span>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>ISO 19344:2015 IDF 232 standardized methodology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>48-hour anaerobic incubation at 37°C</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium text-[#214842]">Flow Cytometry Analysis</span>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Propidium iodide/SYTO 9 staining distinguishes viable/damaged cells</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Membrane potential measurements confirm metabolic activity</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium text-[#214842]">qPCR Quantification</span>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Strain-specific 16S rRNA primers verify taxonomic integrity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Metagenomic shotgun sequencing detects contaminant DNA</span>
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Control */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Quality Control</h6>
            <h2 className="text-[#214842] mb-4">Rigorous Testing Standards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive quality control processes ensure every batch meets our strict specifications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Stability Testing Requirements</h3>
              <p className="text-gray-600 mb-4">
                ICH Q1A(R2) guidelines enforce accelerated stability protocols:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-600">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-[#214842]">Condition</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#214842]">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#214842]">Maximum Viability Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">40°C/75% RH</td>
                      <td className="py-3 px-4">6 months</td>
                      <td className="py-3 px-4">≤1 log CFU reduction</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">25°C/60% RH</td>
                      <td className="py-3 px-4">12 months</td>
                      <td className="py-3 px-4">≤0.5 log CFU reduction</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">4°C refrigeration</td>
                      <td className="py-3 px-4">24 months</td>
                      <td className="py-3 px-4">≤0.3 log CFU reduction</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 mt-4">
                Real-time PCR quantification of stress response genes (groEL, dnaK) predicts long-term stability with 92% accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">Supplier Qualification Checklist</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#214842] mb-2">Organic Suppliers Must Provide:</h4>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>USDA/EU organic certification with transaction certificates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Annual soil heavy metal reports (&lt;1ppm Cd, &lt;0.3ppm Hg)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>Wildcrafting permits for &gt;30% wild-sourced botanicals</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#214842] mb-2">Standardized Suppliers Must Demonstrate:</h4>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>ISO 17025 accredited HPLC/GC-MS capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>3-batch minimum consistency reports (±5% markers)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                      <span>ICH Q7-compliant solvent recovery systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-[#214842] mb-4">Quality Parameters Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-600">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-[#214842]">Parameter</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#214842]">Raw Extracts</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#214842]">Standardized Extracts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Identity Testing</td>
                    <td className="py-3 px-4">Macroscopic/HPTLC</td>
                    <td className="py-3 px-4">HPTLC + qPCR</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Potency</td>
                    <td className="py-3 px-4">UV-Vis (total phenols)</td>
                    <td className="py-3 px-4">HPLC (specific markers)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Contaminants</td>
                    <td className="py-3 px-4">Heavy metals, microbes</td>
                    <td className="py-3 px-4">Pesticides, solvents, ARGs</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Stability</td>
                    <td className="py-3 px-4">6-12 months</td>
                    <td className="py-3 px-4">24-36 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 mt-4">
              Certifications impact quality:
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                <span>GMP: Reduces microbial counts by 3-log vs. non-certified</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                <span>ISO 17025: Ensures ±2% analytical accuracy vs. ±15% in-house labs</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Research Publications */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Research Publications</h6>
            <h2 className="text-[#214842] mb-4">Our Contributions to Science</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our contributions to advancing scientific knowledge in herbal medicine
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-semibold text-[#214842] mb-6">PUBLICATIONS</h3>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <p className="text-gray-700">
                  <span className="font-medium">1.</span> Akhina Tom, Zayeem Firoz Hussain, Firoz Hirehal Hussain Mirza, Channangihalli
                  Thimmegowda Sadashiva. Evaluation of the Aqueous Extract of Emblica Officinalis (Storg
                  C) for Bioavailability, Antioxidant, and Immune-Boosting Properties Compared to Synthetic
                  Vitamin. Journal of Food and Nutrition Research. 13(2), 2025, 106-113.
                  <a href="https://pubs.sciepub.com/jfnr/13/2/8" className="text-[#258F67] ml-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://pubs.sciepub.com/jfnr/13/2/8
                  </a>
                </p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-700">
                  <span className="font-medium">2.</span> Sudhanva M S, Akhina Tom, Firoz H M, Zayeem Firoz Hussain, Sadashiva CT, Shobith
                  Rangappa. Anti-Obesity Effects of Cissus Quadrangularis (Cissuslean®) in C57bl/6j Mice
                  with High-Fat-Diet Induced Obesity and 3t3-L1 Adipocytes. Journal of Food and Nutrition
                  Research. Vol. 13, No. 1, 2025, pp 9-17.
                  <a href="https://pubs.sciepub.com/jfnr/13/1/2" className="text-[#258F67] ml-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://pubs.sciepub.com/jfnr/13/1/2
                  </a>
                </p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-700">
                  <span className="font-medium">3.</span> Firoz Hirehal Hussain Mirza, Channangihalli Thimmegowda Sadashiva, Sreedrisya A
                  K. In vitro antioxidant and in vivo immunomodulatory study of Lemon peel extract (Storg
                  FA) and its Bioavailability assessment. International journal of pharmaceutical sciences
                  and research 2024, 15(7): 2017-2027.
                  <a href="https://doi.org/10.13040/IJPSR.0975-8232.15(7).2017-27" className="text-[#258F67] ml-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://doi.org/10.13040/IJPSR.0975-8232.15(7).2017-27
                  </a>
                </p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-700">
                  <span className="font-medium">4.</span> Firoz Hirehal Hussain Mirza, Sadashiva Channangihalli Thimmegowda. Assessment of
                  the bioavailability of a natural supplement (Storg HIMmax) against cyclophosphamide-
                  induced immunosuppression models and its effect on in vivo immunomodulation and in vitro
                  antioxidant capacity. Journal of Medicinal Plants Research 2024,18(6): 85-94.
                  <a href="https://scholar.google.com/scholar?q=10.5897%2FJMPR2024.7338" className="text-[#258F67] ml-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    DOI: 10.5897/JMPR2024.7338
                  </a>
                </p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-700">
                  <span className="font-medium">5.</span> Firoz Hirehal Hussain Mirza, Channangihalli Thimmegowda Sadashiva, Sahana
                  Chigahalli Vasanth. In vitro Antioxidant, In vivo Bioavailability, and Immunomodulatory
                  Effects of a Polyherbal Formulation (Storg B) Induced by Cyclophosphamide in an
                  Experimental Animal Model. Journal of Pharmaceutical Research International. 36(4):11-
                  23, 2024.
                  <a href="https://doi.org/10.9734/jpri/2024/v36i47508" className="text-[#258F67] ml-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://doi.org/10.9734/jpri/2024/v36i47508
                  </a>
                </p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-700">
                  <span className="font-medium">6.</span> Firoz Hirehal Hussain Mirza, Channangihalli Thimmegowda Sadashiva, Neethumol
                  Benny, Rashmi Yoganand and Nimisha Singh. A Novel Approach to Defeat Obesity:
                  An in vitro and in vivo Evaluation of the Active Diterpene in Coleus forskohlii (Forcslim ™ ).
                  International Journal of Pharmacology. 20 (1): 72-80, 2024.
                  <a href="https://scialert.net/fulltext/fulltextpdf.php?pdf=ansinet/ijp/2024/72-80.pdf" className="text-[#258F67] ml-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://scialert.net/fulltext/fulltextpdf.php?pdf=ansinet/ijp/2024/72-80.pdf
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button asChild className="cta-secondary">
                <Link href="/blog/category/publications" className="flex items-center justify-center">
                  View All Publications
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Award className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Patents</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our team has filed 41+ patents for novel formulations and extraction processes, including:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Novel curcumin formulation with enhanced bioavailability</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Eco-friendly extraction process for medicinal herbs</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Standardized herbal extracts with improved stability</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Synergistic herbal formulations for specific health conditions</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#214842]/10 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Microscope className="h-7 w-7 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Ongoing Research</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our current research initiatives focus on:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Advanced delivery systems for lipophilic herbal compounds</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Clinical validation of traditional herbal formulations</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Sustainable and eco-friendly extraction technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2 mt-2"></span>
                  <span className="text-gray-700">Novel applications for traditional herbs in modern health challenges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
