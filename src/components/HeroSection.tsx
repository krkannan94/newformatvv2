import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <Badge className="w-fit bg-accent text-accent-foreground">
              Leading Commercial Real Estate
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-semibold text-foreground leading-tight">
                Transform Your 
                <span className="text-primary"> Business</span> with 
                Premium Real Estate
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Unlock opportunities in commercial real estate with CBRE's global expertise, 
                innovative solutions, and unmatched market insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Explore Properties
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-semibold text-foreground">$120B+</div>
                <div className="text-sm text-muted-foreground">Transactions Annually</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">5B+ sq ft</div>
                <div className="text-sm text-muted-foreground">Under Management</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1595197658178-79247d3a7941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9mZmljZSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1OTE0NTkxNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern office building"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card rounded-xl p-4 shadow-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">Live Market Data</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-card rounded-xl p-4 shadow-lg border border-border">
              <div className="text-sm text-muted-foreground">Properties Available</div>
              <div className="text-xl font-semibold text-primary">2,347</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}