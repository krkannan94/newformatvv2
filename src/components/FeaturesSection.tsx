import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Building2, TrendingUp, Users, Globe, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Property Management",
    description: "Comprehensive property management solutions with real-time analytics and tenant services.",
    badge: "Popular"
  },
  {
    icon: TrendingUp,
    title: "Market Analytics",
    description: "Advanced market insights and data-driven investment strategies for optimal returns.",
    badge: "New"
  },
  {
    icon: Users,
    title: "Expert Advisory",
    description: "Access to industry experts and personalized advisory services for strategic decisions.",
    badge: null
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Worldwide presence with local expertise in over 100 countries and regions.",
    badge: null
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Comprehensive risk assessment and mitigation strategies for secure investments.",
    badge: null
  },
  {
    icon: Zap,
    title: "Digital Innovation",
    description: "Cutting-edge technology solutions for streamlined operations and enhanced efficiency.",
    badge: "Featured"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-accent text-accent-foreground">
            Our Services
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-semibold text-foreground mb-6">
            Everything you need to succeed in commercial real estate
          </h2>
          <p className="text-lg text-muted-foreground">
            From property management to investment advisory, we provide comprehensive 
            solutions tailored to your business needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {feature.badge && (
                      <Badge variant={feature.badge === "New" ? "default" : "secondary"} className="text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
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
}