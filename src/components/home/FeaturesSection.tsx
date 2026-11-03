import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { CAMPUS_FEATURES } from '@/data/sampleCampusData';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="ENGINEERED FOR PRECISION"
          title="Cutting-Edge Campus Wayfinding Features"
          subtitle="Built from the ground up to eliminate campus navigation friction for new students, parents, faculty, and campus administrators."
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAMPUS_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
