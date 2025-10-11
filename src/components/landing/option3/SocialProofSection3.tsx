import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "VP of Operations",
    company: "Global Energy Corp",
    content: "MineTrak has revolutionized our maintenance operations. The offline capability alone saved us countless hours of downtime.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    title: "Maintenance Director",
    company: "Advanced Manufacturing Inc",
    content: "We reduced maintenance response time by 65% in the first quarter. The ROI was immediate and substantial.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Lisa Martinez",
    title: "Safety & Compliance Manager",
    company: "Industrial Solutions Ltd",
    content: "The compliance dashboards and audit-ready exports have made regulatory inspections a breeze. Highly recommend.",
    rating: 5,
    avatar: "LM"
  }
];

const integrations = [
  { name: "Twilio", logo: "📱" },
  { name: "SendGrid", logo: "📧" },
  { name: "Salesforce", logo: "☁️" },
  { name: "HubSpot", logo: "🎯" },
  { name: "Zapier", logo: "⚡" },
  { name: "Microsoft", logo: "🪟" }
];

const SocialProofSection3 = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Client Logos */}
        <div className="mb-20">
          <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wider font-semibold">
            Trusted by Industry Leaders
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-32 h-16 bg-card rounded-lg border border-border flex items-center justify-center hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Industry Leaders Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card 
                key={idx}
                className="relative border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="pt-8">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                      <span className="font-bold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-10">
            Seamlessly Integrates With Your Stack
          </h3>
          
          <div className="flex items-center justify-center gap-10 flex-wrap max-w-5xl mx-auto">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-20 h-20 bg-card rounded-xl border-2 border-border flex items-center justify-center text-4xl group-hover:border-primary group-hover:shadow-lg transition-all duration-300">
                  {integration.logo}
                </div>
                <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {integration.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection3;
