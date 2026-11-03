import React from 'react';
import { DESTINATION_CATEGORIES } from '@/data/sampleCampusData';
import { DestinationCard } from './DestinationCard';
import { SectionHeading } from '../ui/SectionHeading';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export const QuickDestinations: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            align="left"
            badge="CAMPUS DIRECTORY"
            title="Where would you like to go?"
            subtitle="Explore key departments, modern learning spaces, dining options, and recreation facilities across the campus."
          />
          <Link
            href="/facilities"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap group shrink-0"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATION_CATEGORIES.map((cat) => (
            <DestinationCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};
