const founders = [
  // Stefano commented out for demo version
  // {
  //   name: "Stefano",
  //   role: "Co-Founder",
  //   image: "/founders/stefano.png",
  //   bio: "Stefano has 10 years of programming experience, has bootstrapped multiple products, and has worked at various startups. He has mentored aspiring coders and spent the last three years specializing in blockchain development. Now, he is combining his technical expertise with his entrepreneurial drive to lead his own product",
  //   twitter: "#",
  //   linkedin: "#",
  //   email: "alex@blocksight.ai"
  // },
  {
    name: "Devon Martens",
    role: "Co-Founder",
    image: "/founders/devon.png",
    bio: "Devon builds systems where intelligence meets trustless infrastructure. From architecting AI-driven trading engines managing $50M+ in liquidity to leading Studio Chain, a Layer 2 network for adaptive game economies, her work unites blockchain data, machine learning, and decentralized reasoning. Now, she's shaping the next generation of AI — transparent, autonomous, and analysis of on-chain data.",
    twitter: "#",
    linkedin: "#",
    email: "sarah@blocksight.ai",
  },
  {
    name: "Dr. Petrus C. Martens",
    role: "Co-Founder",
    image: "/founders/petrus.png",
    bio: "Petrus brings over two decades of NASA- and NSF-funded research in machine learning, solar physics, and predictive modeling to Hybrid Intelligence Systems. As a professor at Georgia State University and co-founder of multiple research initiatives including the Virtual Solar Observatory and Data Mining Lab  he has led pioneering work in large-scale data analysis, AI-driven forecasting, and autonomous scientific systems. His expertise in interpretable AI, scientific data infrastructure, and real-time prediction directly informs the company's mission to build transparent, human-aligned intelligence on blockchain.",
    twitter: "#",
    linkedin: "#",
    email: "jordan@blocksight.ai",
  },
];

export function FoundersSection() {
  return (
    <section
      id="founders"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background"
    >
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
            We&apos;re a team of blockchain enthusiasts, data scientists, and
            product builders united by a vision to make DAO analytics accessible
            and actionable.
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
                {/* <div className="flex gap-3">
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
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
