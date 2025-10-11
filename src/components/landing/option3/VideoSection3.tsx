import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, QrCode, Wifi, FileText, BarChart3 } from "lucide-react";

const timestamps = [
  { time: "0:15", icon: QrCode, label: "QR Scan & Access" },
  { time: "0:30", icon: Wifi, label: "Offline Inspection" },
  { time: "0:45", icon: FileText, label: "Auto-Ticket Creation" },
  { time: "1:00", icon: BarChart3, label: "Dashboard Analytics" }
];

const VideoSection3 = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary border-primary/30">
              90-Second Demo
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              See the Complete Workflow
            </h2>
            <p className="text-xl text-slate-300">
              From QR scan to dashboard insights — watch how MineTrak transforms maintenance operations
            </p>
          </div>

          <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              <Button size="lg" className="gap-3 text-lg shadow-xl shadow-primary/50">
                <Play className="w-6 h-6" />
                Play Full Demo
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {timestamps.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary/30">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-primary font-bold mb-1">{item.time}</div>
                  <div className="text-sm text-slate-300">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection3;
