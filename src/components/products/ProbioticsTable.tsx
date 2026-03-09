'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Product } from '@/data/types';

interface ProbioticsTableProps {
  products: Product[];
}

export default function ProbioticsTable({ products }: ProbioticsTableProps) {
  // Use DB products if available, fallback to empty array
  // We can sort them or just map over them
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
            {products.length > 0 ? (
              products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.probioticDetails?.sporesPerGram || 'N/A'}</TableCell>
                  <TableCell>{product.probioticDetails?.method || 'N/A'}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-600">
                  No probiotic products available at the moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
