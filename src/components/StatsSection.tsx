import { ImageWithFallback } from "./figma/ImageWithFallback";

const stats = [
  {
    number: "120B+",
    label: "Annual Transaction Volume",
    description: "In commercial real estate transactions globally"
  },
  {
    number: "100K+",
    label: "Active Clients",
    description: "Worldwide trust CBRE for their real estate needs"
  },
  {
    number: "5B+ sq ft",
    label: "Under Management",
    description: "Commercial space managed across all sectors"
  },
  {
    number: "100+",
    label: "Countries & Territories",
    description: "Global presence with local market expertise"
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758518727077-ffb66ffccced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBvZmZpY2V8ZW58MXx8fHwxNzU5MTI4MTk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Business meeting"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            </div>

            {/* Floating Achievement Badge */}
            <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">#1</div>
                <div className="text-xs opacity-90">Global Leader</div>
              </div>
            </div>
          </div>

          {/* Stats Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
                Trusted by businesses worldwide
              </h2>
              <p className="text-lg text-muted-foreground">
                Our global reach and local expertise make us the preferred partner 
                for commercial real estate solutions across all major markets.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-foreground">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground mb-3">
                Trusted by Fortune 500 companies
              </div>
              <div className="flex items-center space-x-6 opacity-60">
                <div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  LOGO
                </div>
                <div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  LOGO
                </div>
                <div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  LOGO
                </div>
                <div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  LOGO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}