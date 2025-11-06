import { Linkedin, Mail, Twitter } from 'lucide-react';

const founders = [
  {
    name: "Alex Chen",
    role: "Co-Founder & CEO",
    image: "https://images.unsplash.com/photo-1564518534518-e79657852a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWNoJTIwZm91bmRlcnxlbnwxfHx8fDE3NjI0MDQ4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Former Head of Analytics at a leading DeFi protocol with 10+ years in blockchain and data science. Passionate about making DAO governance more transparent and data-driven.",
    twitter: "#",
    linkedin: "#",
    email: "alex@blocksight.ai"
  },
  {
    name: "Sarah Martinez",
    role: "Co-Founder & CTO",
    image: "https://images.unsplash.com/photo-1595017734643-07386d930c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwY2VvJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyMzQxOTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "AI researcher and blockchain architect with experience building scalable data pipelines. Previously led engineering teams at top Web3 companies. Believes in the power of AI to unlock community insights.",
    twitter: "#",
    linkedin: "#",
    email: "sarah@blocksight.ai"
  },
  {
    name: "Jordan Park",
    role: "Co-Founder & Chief Product Officer",
    image: "https://images.unsplash.com/photo-1758598497528-d8d9b3f22894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZW50cmVwcmVuZXVyJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYyNDA0ODI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Product strategist with a track record of launching successful DAO tools. Expert in community building and governance design. On a mission to help DAOs understand and grow their communities.",
    twitter: "#",
    linkedin: "#",
    email: "jordan@blocksight.ai"
  }
];

export function FoundersSection() {
  return (
    <section id="founders" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm mb-6">
            <span className="text-sm text-accent">Meet the Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 md:mb-6">
            The Minds Behind BlockSight
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re a team of blockchain enthusiasts, data scientists, and product builders united by a vision to make DAO analytics accessible and actionable.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="group relative bg-card border border-accent/20 rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="aspect-square overflow-hidden bg-accent/5">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl mb-1">{founder.name}</h3>
                <p className="text-accent mb-4">{founder.role}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {founder.bio}
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  <a
                    href={founder.linkedin}
                    className="w-10 h-10 rounded-lg border border-accent/20 flex items-center justify-center hover:bg-accent/10 hover:border-accent/40 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href={founder.twitter}
                    className="w-10 h-10 rounded-lg border border-accent/20 flex items-center justify-center hover:bg-accent/10 hover:border-accent/40 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href={`mailto:${founder.email}`}
                    className="w-10 h-10 rounded-lg border border-accent/20 flex items-center justify-center hover:bg-accent/10 hover:border-accent/40 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
