import Image from "next/image";

export function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "API", "Documentation"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Community", "Help Center", "Partners", "Status"],
    Legal: ["Privacy", "Terms", "Security", "Compliance"]
  };

    const logoUrl:string  = "/project-logo-nobg.png";
  return (

    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-white flex items-center justify-center">
                <Image src={logoUrl} alt="The amazing logo of the blocksight" width={25} height={25} >
                </Image>
              </div>
              <span className="text-sm sm:text-base">BlockSight</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              AI-powered analytics for the future of coordination.
            </p>
          </div>
          
          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-3 sm:mb-4 text-sm sm:text-base">{category}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-xs sm:text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © 2025 BlockSight. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-xs sm:text-sm">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-xs sm:text-sm">
              Discord
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-xs sm:text-sm">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}