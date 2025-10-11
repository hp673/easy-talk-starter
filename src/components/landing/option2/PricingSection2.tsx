import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "$99",
    period: "per month",
    description: "Perfect for small teams",
    features: [
      { name: "Up to 10 users", included: true },
      { name: "Basic inspections", included: true },
      { name: "Offline support", included: true },
      { name: "Email support", included: true },
      { name: "Workplace EAM forms", included: false },
      { name: "Advanced analytics", included: false }
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "$499",
    period: "per month",
    description: "For growing teams",
    features: [
      { name: "Up to 50 users", included: true },
      { name: "Multi-site management", included: true },
      { name: "Workplace EAM forms", included: true },
      { name: "Smart ticketing", included: true },
      { name: "CRM integrations", included: true },
      { name: "Priority support", included: true }
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations",
    features: [
      { name: "Unlimited users", included: true },
      { name: "SSO integration", included: true },
      { name: "Full API access", included: true },
      { name: "Advanced EAM workflows", included: true },
      { name: "SLA guarantees", included: true },
      { name: "On-premise deployment", included: true }
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const PricingSection2 = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingTiers.map((tier, idx) => (
            <Card 
              key={idx} 
              className={`relative flex flex-col ${
                tier.popular 
                  ? 'border-primary shadow-lg' 
                  : 'border-border'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.price !== "Custom" && (
                    <span className="text-muted-foreground ml-1 text-sm">{tier.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground text-sm"}>
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

export default PricingSection2;
