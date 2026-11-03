import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import {
  Search,
  Route,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'STEP 1',
      title: 'Search Your Destination',
      description:
        'Enter the building, department, or facility you want to visit using instant search with autocomplete suggestions.',
      icon: Search,
      color: 'blue',
      badge: 'Start Search',
    },
    {
      step: 'STEP 2',
      title: 'Find the Best Route',
      description:
        'Our navigation system calculates the shortest or most suitable walking route using graph-based Dijkstra algorithms.',
      icon: Route,
      color: 'cyan',
      badge: 'Pathfinding',
    },
    {
      step: 'STEP 3',
      title: 'Reach Your Destination',
      description:
        'Follow clear, turn-by-turn walking instructions with estimated arrival times and accessible pathway options.',
      icon: MapPin,
      color: 'emerald',
      badge: 'Arrive Safely',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="SEAMLESS WAYFINDING"
          title="Campus Navigation Made Simple"
          subtitle="Three effortless steps to find your way anywhere on campus, whether you are a fresher, faculty member, or visiting guest."
          align="center"
          className="mb-16"
        />

        <div className="relative">
          {/* Horizontal Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-24 right-24 -translate-y-8 h-1 bg-gradient-to-r from-blue-300 via-cyan-300 to-emerald-300 -z-0 rounded-full" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
                >
                  <div>
                    {/* Step indicator header */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                        {item.step}
                      </span>
                      <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {item.badge}
                      </span>
                    </div>

                    {/* Step Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                      <Icon className="w-8 h-8 stroke-[2.2]" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footnote / step status */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Optimized for pedestrian walking</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
