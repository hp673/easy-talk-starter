import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "$99",
    period: "per month",
    description: "Perfect for small teams getting started",
    features: [
      { name: "Up to 10 users", included: true },
      { name: "Basic inspections", included: true },
      { name: "Offline support", included: true },
      { name: "Email support", included: true },
      { name: "Mobile app access", included: true },
      { name: "Workplace EAM forms", included: false },
      { name: "Advanced analytics", included: false },
      { name: "API access", included: false },
      { name: "SSO integration", included: false }
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "$499",
    period: "per month",
    description: "For growing teams with advanced needs",
    features: [
      { name: "Up to 50 users", included: true },
      { name: "Multi-site management", included: true },
      { name: "Workplace EAM forms", included: true },
      { name: "Smart ticketing system", included: true },
      { name: "CRM integrations", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "API access", included: false },
      { name: "SSO integration", included: false }
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Tailored solutions for large organizations",
    features: [
      { name: "Unlimited users", included: true },
      { name: "SSO integration", included: true },
      { name: "Full API access", included: true },
      { name: "Advanced EAM workflows", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "SLA guarantees", included: true },
      { name: "On-premise deployment", included: true },
      { name: "Custom integrations", included: true },
      { name: "White-label options", included: true }
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your team. Upgrade or downgrade anytime.
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="text-sm">
              💰 Save 20% with annual billing
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, idx) => (
            <Card 
              key={idx} 
              className={`relative flex flex-col ${
                tier.popular 
                  ? 'border-primary shadow-xl scale-105' 
                  : 'border-border'
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== "Custom" && (
                    <span className="text-muted-foreground ml-2">{tier.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={tier.popular ? "default" : "outline"}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
