import { Button } from "@/components/ui/button";
import { QrCode, FileCheck, Shield, ChevronRight } from "lucide-react";

const WorkplaceEAMSection2 = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Mockup */}
          <div className="relative">
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <div className="aspect-[4/3] bg-muted rounded-lg"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              Extend Beyond Equipment — Manage Workplace Forms
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Add configurable workplace and EAM forms to your maintenance platform.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <QrCode className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">QR Access</h4>
                  <p className="text-muted-foreground">Scan and access forms instantly from any location</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Audit-Ready Exports</h4>
                  <p className="text-muted-foreground">Generate compliance reports with one click</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Compliance Support</h4>
                  <p className="text-muted-foreground">TCEQ and safety checklist templates included</p>
                </div>
              </li>
            </ul>

            <Button size="lg">
              Explore Workplace EAM
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkplaceEAMSection2;
