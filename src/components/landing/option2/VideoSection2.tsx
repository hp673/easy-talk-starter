import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const VideoSection2 = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">
              See MineTrak in Action
            </h2>
            <p className="text-lg text-muted-foreground">
              Watch how easy it is to digitize inspections and automate maintenance
            </p>
          </div>

          <div className="relative bg-card rounded-xl shadow-lg border border-border overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Button size="lg" className="gap-2">
                <Play className="w-6 h-6" />
                Play Demo Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection2;
