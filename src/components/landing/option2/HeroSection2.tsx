import { Button } from "@/components/ui/button";
import { Play, ChevronRight } from "lucide-react";

const HeroSection2 = () => {
  return (
    <section className="relative pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center space-y-8">
          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Streamline Inspections.
            <br />
            <span className="text-primary">Simplify Maintenance.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            One platform for operators, technicians, and managers — offline capable, easy to deploy.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg">
              Request Demo
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              <Play className="mr-2 w-5 h-5" />
              Watch Product Video
            </Button>
          </div>

          {/* Mockup */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="relative bg-card rounded-xl shadow-lg border border-border p-6">
              <div className="aspect-[16/10] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Product Demo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Logos */}
          <div className="pt-12">
            <p className="text-sm text-muted-foreground mb-6">Trusted by leading industrial teams</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-24 h-12 bg-muted rounded flex items-center justify-center"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;
