import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "$99",
    period: "per month",
    description: "Essential tools for small teams",
    features: [
      "Up to 10 users",
      "Basic inspections & forms",
      "Offline support",
      "Mobile app access",
      "Email support"
    ],
    cta: "Start Free Trial",
    popular: false,
    highlight: false
  },
  {
    name: "Professional",
    price: "$499",
    period: "per month",
    description: "Advanced features for growing operations",
    features: [
      "Up to 50 users",
      "Multi-site management",
      "Workplace EAM forms",
      "Smart ticketing system",
      "CRM integrations",
      "Advanced analytics",
      "Priority support"
    ],
    cta: "Start Free Trial",
    popular: true,
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Unlimited scale with premium support",
    features: [
      "Unlimited users",
      "SSO integration",
      "Full API access",
      "Advanced EAM workflows",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premise deployment",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    popular: false,
    highlight: false
  }
];

const PricingSection3 = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Enterprise Pricing Built for Scale
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that matches your team size and operational complexity
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="text-base px-4 py-2">
              💰 Save 20% with annual billing
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, idx) => (
            <Card 
              key={idx} 
              className={`relative flex flex-col transition-all duration-300 ${
                tier.highlight
                  ? 'border-primary shadow-2xl scale-105 bg-gradient-to-br from-white to-primary/5' 
                  : 'border-border hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1.5 text-sm shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  {tier.price !== "Custom" && (
                    <span className="text-muted-foreground ml-2 text-lg">{tier.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        tier.highlight ? 'bg-primary' : 'bg-primary/10'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          tier.highlight ? 'text-white' : 'text-primary'
                        }`} />
                      </div>
                      <span className="text-foreground font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button 
                  className={`w-full ${tier.highlight ? 'shadow-lg shadow-primary/50' : ''}`}
                  variant={tier.highlight ? "default" : "outline"}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Need a custom plan? <a href="#contact" className="text-primary font-semibold hover:underline">Talk to our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection3;
