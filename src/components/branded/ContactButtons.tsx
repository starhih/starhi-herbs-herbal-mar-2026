'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Phone } from 'lucide-react';

export default function ContactButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button className="bg-[#214842] hover:bg-[#214842]/90">
        Request a Quote
      </Button>
      <Button variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842]/10">
        Request a Sample
      </Button>
      <Button variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842]/10">
        <Download size={16} className="mr-2" />
        Download Catalogue
      </Button>
    </div>
  );
}
