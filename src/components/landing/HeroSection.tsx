import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Shield, ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-20 pb-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="gap-2">
              <Shield className="w-4 h-4" />
              Trusted by Industrial Leaders
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Digitize Every Inspection. 
              <span className="text-primary block mt-2">
                Automate Every Maintenance Task.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              MineTrak connects operators, technicians, and managers in one offline-capable maintenance ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg">
                Request Demo
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Play className="mr-2 w-5 h-5" />
                Watch Product Video
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Join <span className="font-semibold text-foreground">500+</span> maintenance teams
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative">
            <div className="relative bg-card rounded-2xl shadow-2xl p-8 border border-border">
              <div className="aspect-[4/3] bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Interactive Product Demo</p>
                </div>
              </div>
              
              {/* Trust Badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Offline-First</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
