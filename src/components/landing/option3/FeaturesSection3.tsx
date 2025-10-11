import { useState } from "react";
import { Wifi, FileText, Ticket, AlertTriangle, BarChart3, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const features = [
  {
    icon: Wifi,
    title: "Offline-First Inspections",
    description: "Work without connectivity. Full inspection capabilities offline with automatic sync when back online.",
    role: "operator"
  },
  {
    icon: FileText,
    title: "Dynamic Workplace & EAM Forms",
    description: "Customizable forms for any scenario. QR-enabled access, digital signatures, and photo documentation.",
    role: "operator"
  },
  {
    icon: AlertTriangle,
    title: "Critical Defect Detection",
    description: "AI-powered defect classification with instant notifications and automated escalation workflows.",
    role: "technician"
  },
  {
    icon: Ticket,
    title: "Smart Maintenance Tickets",
    description: "Auto-generate tickets from critical defects. Track progress, assign technicians, and monitor SLAs.",
    role: "technician"
  },
  {
    icon: BarChart3,
    title: "Compliance Dashboards",
    description: "Real-time visibility into inspection completion, overdue items, and regulatory compliance metrics.",
    role: "manager"
  },
  {
    icon: Users,
    title: "Multi-Role Collaboration",
    description: "Seamless coordination between operators, technicians, and managers with role-based permissions.",
    role: "manager"
  }
];

const FeaturesSection3 = () => {
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredFeatures = selectedRole === "all" 
    ? features 
    : features.filter(f => f.role === selectedRole);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How MineTrak Helps You Work Smarter
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade features designed for industrial operations
          </p>
        </div>

        <Tabs value={selectedRole} onValueChange={setSelectedRole} className="mb-10">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="operator">Operator</TabsTrigger>
            <TabsTrigger value="technician">Technician</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredFeatures.map((feature, idx) => (
            <Card 
              key={idx} 
              className="border-border hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
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

export default FeaturesSection3;
