import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Maintenance Manager",
    company: "Industrial Corp",
    content: "MineTrak simplified our entire inspection workflow. The offline capability is a game-changer.",
    rating: 5
  },
  {
    name: "Mike Chen",
    title: "Operations Director",
    company: "Manufacturing Inc",
    content: "We've reduced our maintenance response time by 60% since implementing MineTrak.",
    rating: 5
  },
  {
    name: "Lisa Martinez",
    title: "Safety Coordinator",
    company: "Energy Solutions",
    content: "The compliance tracking and audit-ready reports save us hours every week.",
    rating: 5
  }
];

const integrations = [
  { name: "Twilio", logo: "📱" },
  { name: "SendGrid", logo: "📧" },
  { name: "Salesforce", logo: "☁️" },
  { name: "HubSpot", logo: "🎯" },
  { name: "Zapier", logo: "⚡" }
];

const SocialProofSection2 = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Our Customers Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">
            Integrates With Your Stack
          </h3>
          
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 bg-card rounded-lg border border-border flex items-center justify-center text-3xl">
                  {integration.logo}
                </div>
                <span className="text-sm text-muted-foreground">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection2;
