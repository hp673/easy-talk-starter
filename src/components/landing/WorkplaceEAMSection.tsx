import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight } from "lucide-react";

const eamFeatures = [
  "Admin-configurable workplace templates",
  "QR-based instant access to forms",
  "Audit-ready PDF exports",
  "TCEQ & safety checklist support",
  "Multi-site workplace management",
  "Compliance tracking & reporting"
];

const WorkplaceEAMSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Mockup */}
          <div className="order-2 lg:order-1">
            <div className="relative bg-card rounded-2xl shadow-2xl p-8 border border-border">
              <div className="aspect-[3/4] bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <Badge className="mb-4">Workplace EAM</Badge>
                  <div className="space-y-2">
                    <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-primary/20 rounded w-full"></div>
                    <div className="h-4 bg-primary/20 rounded w-5/6 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <Badge variant="secondary" className="mb-4">
              Differentiator
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Extend Beyond Equipment — 
              <span className="text-primary block mt-2">
                Manage Workplace EAM Forms Too
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              MineTrak goes beyond equipment maintenance with comprehensive workplace environmental and safety management capabilities.
            </p>

            <div className="space-y-3">
              {eamFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-6">
              Explore Workplace EAM
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkplaceEAMSection;
