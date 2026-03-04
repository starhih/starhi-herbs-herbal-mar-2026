'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProbioticProduct {
  id: number;
  name: string;
  sporesPerGram: string;
  method: string;
}

const probioticProducts: ProbioticProduct[] = [
  {
    id: 1,
    name: 'Bacillius clausii',
    sporesPerGram: '25,200,300',
    method: 'Microscopy'
  },
  {
    id: 2,
    name: 'Bacillius Lichenformis',
    sporesPerGram: '200',
    method: 'Microscopy'
  },
  {
    id: 3,
    name: 'Bacillus SP ( Blend of B. coagulans, B.Clausii, B.Subtilis)',
    sporesPerGram: '350',
    method: 'Microscopy'
  },
  {
    id: 4,
    name: 'Bacillius Subtilis',
    sporesPerGram: '100,200',
    method: 'Microscopy'
  },
  {
    id: 5,
    name: 'Bacillus Coagullans (Bacospore)',
    sporesPerGram: '200',
    method: 'Microscopy'
  }
];

export default function ProbioticsTable() {
  return (
    <div className="w-full my-8">
      <h2 className="text-2xl font-semibold text-[#214842] mb-6">Probiotics Products</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">SL. No</TableHead>
              <TableHead>Probiotics</TableHead>
              <TableHead>Unit Billion Spores per gram</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {probioticProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sporesPerGram}</TableCell>
                <TableCell>{product.method}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white">
                      <Link href="/request-quote">Request Quote</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-[#214842] text-[#214842] hover:bg-[#214842] hover:text-white">
                      <Link href="/request-sample">Request Sample</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
