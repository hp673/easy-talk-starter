import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wifi, 
  FileText, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  QrCode 
} from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "Offline-First Inspections",
    description: "Complete inspections without internet. Data syncs automatically when back online.",
    role: "operator"
  },
  {
    icon: FileText,
    title: "Dynamic Workplace & EAM Forms",
    description: "Flexible form templates for equipment and workplace inspections with QR access.",
    role: "all"
  },
  {
    icon: AlertTriangle,
    title: "Critical Defect Detection",
    description: "Auto-escalate critical issues with photo evidence and instant notifications.",
    role: "technician"
  },
  {
    icon: Wrench,
    title: "Smart Maintenance Tickets",
    description: "Convert defects to tickets with priority routing and real-time tracking.",
    role: "technician"
  },
  {
    icon: BarChart3,
    title: "Compliance Dashboards",
    description: "Real-time analytics, audit trails, and regulatory compliance reporting.",
    role: "manager"
  },
  {
    icon: QrCode,
    title: "QR Code Integration",
    description: "Instant equipment access via QR scan with complete maintenance history.",
    role: "operator"
  }
];

const FeaturesSection = () => {
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredFeatures = selectedRole === "all" 
    ? features 
    : features.filter(f => f.role === "all" || f.role === selectedRole);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How MineTrak Helps You Work Smarter
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for the realities of industrial operations
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-12" onValueChange={setSelectedRole}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="operator">Operator</TabsTrigger>
            <TabsTrigger value="technician">Technician</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
