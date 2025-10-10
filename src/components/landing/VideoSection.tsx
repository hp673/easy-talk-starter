import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              See MineTrak in Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Watch how teams digitize inspections from QR scan to automated ticketing
            </p>
          </div>

          <div className="relative aspect-video bg-card rounded-2xl shadow-2xl border border-border overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Button 
                size="lg" 
                className="w-20 h-20 rounded-full group-hover:scale-110 transition-transform"
              >
                <Play className="w-10 h-10" />
              </Button>
            </div>
            
            {/* Video timestamps overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-sm rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-primary font-semibold">0:00-0:20</div>
                  <div className="text-muted-foreground">QR Scan & Access</div>
                </div>
                <div>
                  <div className="text-primary font-semibold">0:20-0:50</div>
                  <div className="text-muted-foreground">Offline Inspection</div>
                </div>
                <div>
                  <div className="text-primary font-semibold">0:50-1:30</div>
                  <div className="text-muted-foreground">Auto-Ticket & Dashboard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
