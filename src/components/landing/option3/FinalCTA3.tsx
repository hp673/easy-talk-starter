import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Check } from "lucide-react";

const FinalCTA3 = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
            Ready to Modernize Your Maintenance Operations?
          </h2>
          
          <p className="text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Join hundreds of industrial teams digitizing inspections and automating maintenance with MineTrak
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-shadow"
            >
              <Calendar className="mr-2 w-6 h-6" />
              Schedule a Free Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground"
            >
              View Pricing
              <ChevronRight className="ml-2 w-6 h-6" />
            </Button>
          </div>

          <div className="pt-12 grid sm:grid-cols-3 gap-6 text-primary-foreground/90">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center border-2 border-primary-foreground/30">
                <Check className="w-6 h-6" />
              </div>
              <span className="font-semibold">14-day free trial</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center border-2 border-primary-foreground/30">
                <Check className="w-6 h-6" />
              </div>
              <span className="font-semibold">No credit card required</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center border-2 border-primary-foreground/30">
                <Check className="w-6 h-6" />
              </div>
              <span className="font-semibold">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA3;
