import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            Ready to Modernize Your Maintenance Operations?
          </h2>
          
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join hundreds of industrial teams using MineTrak to digitize inspections, automate maintenance, and stay compliant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Schedule a Free Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground"
            >
              View Pricing
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              ✓ 14-day free trial
            </div>
            <div className="flex items-center gap-2">
              ✓ No credit card required
            </div>
            <div className="flex items-center gap-2">
              ✓ Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
