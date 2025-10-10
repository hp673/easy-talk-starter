import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Maintenance Manager",
    company: "Allied Mining Corp",
    content: "MineTrak reduced our inspection completion time by 60% and eliminated paper forms entirely. The offline capability is a game-changer.",
    rating: 5
  },
  {
    name: "Mike Rodriguez",
    role: "Site Supervisor",
    company: "Industrial Solutions Inc",
    content: "The Workplace EAM forms help us stay compliant with TCEQ requirements. Audit exports are clean and professional.",
    rating: 5
  },
  {
    name: "Emily Chen",
    role: "Operations Director",
    company: "Peak Performance Mining",
    content: "We manage 12 sites with MineTrak. The analytics dashboard gives us real-time visibility we never had before.",
    rating: 5
  }
];

const integrations = [
  { name: "Twilio", logo: "📱" },
  { name: "SendGrid", logo: "✉️" },
  { name: "Stripe", logo: "💳" },
  { name: "Salesforce", logo: "☁️" },
  { name: "HubSpot", logo: "🎯" },
  { name: "Zapier", logo: "⚡" }
];

const SocialProofSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Trusted By */}
        <div className="text-center mb-16">
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-8">
            Trusted by Industry Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="w-32 h-12 bg-muted/50 rounded flex items-center justify-center text-muted-foreground"
              >
                Logo {i}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="relative">
                <CardContent className="pt-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    "{testimonial.content}"
                  </p>
                  
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">
            Seamlessly Integrates With Your Stack
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {integrations.map((integration, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <span className="text-3xl">{integration.logo}</span>
                <span className="font-semibold">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
