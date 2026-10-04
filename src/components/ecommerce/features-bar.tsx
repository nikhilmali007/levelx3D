import { Cpu, ShieldCheck, Box, Zap, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Cpu,
    title: 'Aerospace SLA & SLS',
    desc: 'Down to 12-micron laser sintering precision for extreme structural detail.',
  },
  {
    icon: Box,
    title: 'Instant 3D Preview',
    desc: 'Full 360° interactive WebGL view of geometries and surface finishes.',
  },
  {
    icon: Zap,
    title: 'Rapid Production',
    desc: 'Printed on-demand and shipped internationally within 48-72 hours.',
  },
  {
    icon: ShieldCheck,
    title: 'Structural Guarantee',
    desc: 'High-tensile carbon & titanium composite resin with lifetime warranty.',
  },
];

export function FeaturesBar() {
  return (
    <section className="py-12 border-y border-white/10 bg-slate-950/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan/30 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-cyan/10 text-cyan border border-cyan/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
