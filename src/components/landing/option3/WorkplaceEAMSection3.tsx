import { Button } from "@/components/ui/button";
import { QrCode, FileCheck, Shield, ArrowRight } from "lucide-react";

const eamFeatures = [
  {
    icon: QrCode,
    title: "QR Access",
    description: "Instant form access via QR codes at any location"
  },
  {
    icon: FileCheck,
    title: "Audit-Ready Exports",
    description: "One-click compliance reports and exports"
  },
  {
    icon: Shield,
    title: "Safety & TCEQ Support",
    description: "Pre-built templates for regulatory compliance"
  }
];

const WorkplaceEAMSection3 = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
              <span className="text-primary font-semibold">Key Differentiator</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Extend Beyond Equipment — Manage Workplace EAM Forms
            </h2>
            
            <p className="text-xl text-slate-300">
              Complete workplace and environmental, asset, and maintenance forms alongside your equipment inspections.
            </p>

            <div className="space-y-6">
              {eamFeatures.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary/30">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="shadow-lg shadow-primary/50">
              Explore Workplace EAM
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkplaceEAMSection3;
