import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ChevronRight, Zap } from "lucide-react";

const HeroSection3 = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="gap-2 bg-primary/20 text-primary border-primary/30">
              <Zap className="w-4 h-4" />
              Enterprise-Ready Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
              Digitize Every Inspection.
              <span className="text-primary block mt-3">
                Automate Every Maintenance Task.
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed">
              Offline-first, multi-role maintenance and EAM forms for industrial operations at scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg shadow-lg shadow-primary/50 hover:shadow-primary/70">
                Request Demo
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-white"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Video
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-slate-800 bg-slate-700"
                  />
                ))}
              </div>
              <div className="text-sm text-slate-400">
                Trusted by <span className="font-bold text-white">500+</span> teams worldwide
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30">
                    <Play className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-slate-300 font-semibold">Interactive Product Demo</p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-xl shadow-primary/50">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <span className="font-bold text-lg">Offline-First</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection3;
