
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FoundersPage() {
  const founders = [
    {
      name: "Alex Johnson",
      initials: "AJ",
      description: "Alex is a visionary leader with a passion for decentralized technologies. He co-founded the company with the aim of making blockchain more accessible to everyone.",
      image: "",
    },
    {
      name: "Samantha Lee",
      initials: "SL",
      description: "Samantha is a brilliant engineer who architected our core platform. She has over 15 years of experience in building scalable and secure systems.",
      image: "",
    },
    {
      name: "David Chen",
      initials: "DC",
      description: "David is a product-focused founder who ensures that we are building something that people love. He is obsessed with user experience and design.",
      image: "",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Founders</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {founders.map((founder) => (
          <div key={founder.name} className="flex flex-col items-center text-center">
            <Avatar className="w-48 h-48 mb-4">
              <AvatarImage src={founder.image} alt={founder.name} />
              <AvatarFallback className="text-4xl">{founder.initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{founder.name}</h2>
            <p className="text-muted-foreground mt-2">{founder.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
