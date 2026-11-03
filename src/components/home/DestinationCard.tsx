import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Building2,
  Utensils,
  Trophy,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { DestinationCategory } from '@/data/sampleCampusData';

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Building2,
  Utensils,
  Trophy,
};

export interface DestinationCardProps {
  category: DestinationCategory;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ category }) => {
  const IconComponent = iconMap[category.iconName] || Building2;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${category.colorScheme.bg} ${category.colorScheme.border}`}
    >
      <div>
        {/* Card Header with Icon & Count Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${category.colorScheme.iconBg}`}
          >
            <IconComponent className="w-6 h-6 stroke-[2]" />
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${category.colorScheme.tagBg} ${category.colorScheme.tagText}`}
          >
            {category.buildingCount} {category.buildingCount === 1 ? 'Location' : 'Locations'}
          </span>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Explore Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/explore?category=${category.slug}`}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group/link"
        >
          <span>Explore Category</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-600 transition-colors" />
      </div>
    </div>
  );
};

