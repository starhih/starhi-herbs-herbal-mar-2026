"use client";

import { Counter } from "@/components/ui/animated-counter";
import {
  Leaf,
  Factory,
  FileText,
  BookOpen,
  Users
} from "lucide-react";

export default function StatisticsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Impact</h6>
          <h2 className="text-[#214842] mb-4">Star Hi Herbs in Numbers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our commitment to quality, innovation, and sustainability is reflected in our global presence and achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-[#214842]/10 p-3 rounded-lg mb-4">
              <Leaf className="h-6 w-6 text-[#214842]" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <Counter end={30000} duration={2.5} fontSize={36} />
            </div>
            <h3 className="text-lg font-semibold text-[#214842] mb-2">Acres of Cultivation</h3>
            <p className="text-gray-600 text-sm">Contract Farming</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-[#214842]/10 p-3 rounded-lg mb-4">
              <Factory className="h-6 w-6 text-[#214842]" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <Counter end={6000} duration={2.5} fontSize={36} />
            </div>
            <h3 className="text-lg font-semibold text-[#214842] mb-2">Production Capacity</h3>
            <p className="text-gray-600 text-sm">MT/annum</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-[#214842]/10 p-3 rounded-lg mb-4">
              <FileText className="h-6 w-6 text-[#214842]" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <Counter end={27} duration={2.5} fontSize={36} suffix="+" />
            </div>
            <h3 className="text-lg font-semibold text-[#214842] mb-2">Patents</h3>
            <p className="text-gray-600 text-sm">Registered Globally</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-[#214842]/10 p-3 rounded-lg mb-4">
              <BookOpen className="h-6 w-6 text-[#214842]" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <Counter end={20} duration={2.5} fontSize={36} suffix="+" />
            </div>
            <h3 className="text-lg font-semibold text-[#214842] mb-2">Publications</h3>
            <p className="text-gray-600 text-sm">Research Papers</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-[#214842]/10 p-3 rounded-lg mb-4">
              <Users className="h-6 w-6 text-[#214842]" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <Counter end={550} duration={2.5} fontSize={36} suffix="+" />
            </div>
            <h3 className="text-lg font-semibold text-[#214842] mb-2">Customers</h3>
            <p className="text-gray-600 text-sm">Worldwide</p>
          </div>
        </div>
      </div>
    </section>
  );
}
