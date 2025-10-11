import { Wifi, FileText, Ticket, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Wifi,
    title: "Offline Inspections",
    description: "Complete inspections without internet. Data syncs automatically when connection returns."
  },
  {
    icon: FileText,
    title: "Dynamic Workplace Forms",
    description: "Create custom forms for any workplace scenario. QR-enabled access and audit trails."
  },
  {
    icon: Ticket,
    title: "Smart Ticketing",
    description: "Automatically generate maintenance tickets from critical defects. Track resolution in real-time."
  },
  {
    icon: AlertTriangle,
    title: "Critical Alerts",
    description: "Instant notifications for safety issues. Configurable escalation rules and multi-channel delivery."
  }
];

const FeaturesSection2 = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Work Smarter, Faster, Safer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to digitize inspections and automate maintenance workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection2;
