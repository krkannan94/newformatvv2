import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80" />
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1702776734416-f78fafd3d3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHJlYWwlMjBlc3RhdGV8ZW58MXx8fHwxNzU5MTI4MTk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="City skyline"
              className="w-full h-full object-cover"
            />
          </div>
          
          <CardContent className="relative p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-5xl font-semibold text-white leading-tight">
                  Ready to transform your real estate strategy?
                </h2>
                <p className="text-lg text-white/90 max-w-lg">
                  Partner with CBRE's experts to unlock new opportunities and maximize 
                  your real estate investments. Let's build success together.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" variant="secondary" className="group">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white hover:text-primary">
                    Schedule Consultation
                  </Button>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Call Us</div>
                        <div className="text-white/80">+1 (555) 123-4567</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Email Us</div>
                        <div className="text-white/80">contact@cbre.com</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="pt-6">
                  <div className="text-sm text-white/70">
                    Available 24/7 • Response within 2 hours
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}