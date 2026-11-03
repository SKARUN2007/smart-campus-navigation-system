import React from 'react';
import {
  Map,
  Search,
  Route,
  Navigation,
  Compass,
  Smartphone,
  Accessibility,
  Bookmark,
  LucideIcon,
} from 'lucide-react';
import { CampusFeatureItem } from '@/data/sampleCampusData';

const iconMap: Record<string, LucideIcon> = {
  Map,
  Search,
  Route,
  Navigation,
  Compass,
  Smartphone,
  Accessibility,
  Bookmark,
};

export interface FeatureCardProps {
  feature: CampusFeatureItem;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const IconComponent = iconMap[feature.iconName] || Map;

  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
          <IconComponent className="w-6 h-6 stroke-[2]" />
        </div>
        {feature.badge && (
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
            {feature.badge}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};

