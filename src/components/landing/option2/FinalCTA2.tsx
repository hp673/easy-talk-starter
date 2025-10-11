import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const FinalCTA2 = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">
            Ready to Modernize Your Maintenance Operations?
          </h2>
          
          <p className="text-lg text-primary-foreground/90">
            Join hundreds of industrial teams using MineTrak
          </p>

          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg"
          >
            <Calendar className="mr-2 w-5 h-5" />
            Schedule a Free Demo
          </Button>

          <div className="pt-6 flex items-center justify-center gap-6 text-sm text-primary-foreground/80">
            <span>✓ 14-day free trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA2;
