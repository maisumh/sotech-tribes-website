import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import GHLForm from "@/components/ui/GHLForm";
import ClientFAQ from "@/components/ui/ClientFAQ";

export const metadata: Metadata = {
  title: "For Neighbors | Borrow, Share & Help in Your Neighborhood | Tribes™",
  description:
    "Borrow, lend, help, hire, trade - connect with neighbors who have what you need and need what you have.",
};

const useCases = [
  {
    icon: "🔍",
    title: "Need Something?",
    description:
      "Find tools, gear, and items from neighbors instead of buying. Save money and reduce waste.",
  },
  {
    icon: "📦",
    title: "Have Something?",
    description:
      "Share what you own and help neighbors save. That ladder in your garage can help someone today.",
  },
  {
    icon: "🤝",
    title: "Can Help?",
    description:
      "Offer your time for yard work, pet sitting, moving help, and more. Build connections through helping.",
  },
  {
    icon: "💼",
    title: "Offer Services?",
    description:
      "List your professional skills and build a local client base. Photography, web design, tutoring, and more.",
  },
];

const categories = [
  {
    title: "Borrow & Lend Items",
    items: [
      "🔧 Tools & Equipment",
      "👶 Baby & Kids Gear",
      "🏕️ Camping & Outdoor",
      "🎉 Party Supplies",
      "⚽ Sports Equipment",
      "🏠 Household Items",
    ],
  },
  {
    title: "Casual Help",
    items: [
      "🌿 Yard Work",
      "🐕 Pet Sitting",
      "📦 Moving Help",
      "🚗 Rides & Errands",
      "🏡 House Watching",
      "❄️ Snow Removal",
    ],
  },
  {
    title: "Professional Services",
    items: [
      "📸 Photography",
      "💻 Web Design",
      "📚 Tutoring",
      "🔨 Handyman Work",
      "💪 Personal Training",
      "💼 Consulting",
    ],
  },
];

const steps = [
  {
    number: "1",
    title: "List Your Haves and Wants",
    description:
      "Add what you can offer - items to lend, help you can give, or services you provide. Post what you're looking for.",
  },
  {
    number: "2",
    title: "Get Matched with Neighbors",
    description:
      "Smart matching connects you with people nearby who have what you need or need what you have.",
  },
  {
    number: "3",
    title: "Connect and Coordinate",
    description:
      "Message neighbors directly to arrange exchanges, set up help, or book services. You control the details.",
  },
  {
    number: "4",
    title: "Build Your Reputation",
    description:
      "Complete exchanges, leave reviews, and become a trusted member of your neighborhood tribe.",
  },
];

const benefits = [
  {
    icon: "💰",
    title: "Save Money",
    description:
      "Borrow instead of buying. Save $500+ per year by accessing what you need from neighbors.",
  },
  {
    icon: "💵",
    title: "Earn on Your Terms",
    description:
      "Get paid for your skills, accept trades, or give back to your community. You decide.",
  },
  {
    icon: "👋",
    title: "Meet Your Neighbors",
    description:
      "Every exchange is a chance to build real connections with people who live nearby.",
  },
  {
    icon: "🔄",
    title: "Flexible Payment",
    description:
      "Cash, trade, barter, or free - you choose what works for each exchange.",
  },
  {
    icon: "⭐",
    title: "Build Trust",
    description:
      "Ratings and reviews help you find reliable neighbors and build your own reputation.",
  },
  {
    icon: "🏘️",
    title: "Join Your Tribe",
    description:
      "Find communities around shared interests - tool sharing, parents, pets, sustainability, and more.",
  },
];

const testimonial = {
  quotes: [
    '"Last month I borrowed a pressure washer from Tom down the street - saved me $200. I lend out my camping gear all the time; it just sits in the garage otherwise.',
    "I also do freelance photography on the side, and I've booked 3 sessions with neighbors who found me on Tribes. One client even paid me partly in homemade bread (best trade ever).",
    'This is what I love about Tribes - I\'m not just a \'user\' or a \'provider.\' I\'m just... a neighbor. Some days I need help, some days I give it. That\'s how neighborhoods should work."',
  ],
  name: "Jamie T.",
  location: "Riverside Neighborhood",
  stats: [
    { value: "6", label: "Items Borrowed" },
    { value: "8", label: "Items Lent" },
    { value: "3", label: "Photo Sessions" },
    { value: "$650+", label: "Saved & Earned" },
  ],
};

const trustFeatures = [
  {
    icon: "✓",
    title: "Verified Neighbors",
    description:
      "Address verification ensures everyone in your tribe actually lives in your community.",
  },
  {
    icon: "⭐",
    title: "Ratings & Reviews",
    description:
      "Build your reputation through positive exchanges. See ratings before every interaction.",
  },
  {
    icon: "💬",
    title: "In-App Messaging",
    description:
      "Coordinate exchanges without sharing personal phone numbers until you're ready.",
  },
  {
    icon: "🔒",
    title: "Privacy Controls",
    description:
      "You control what you share and who can see it. Your information stays private.",
  },
];

const faqItems = [
  {
    question: "How much does it cost to use Tribes?",
    answer:
      "Tribes is completely free for neighbors. There are no membership fees, subscription costs, or hidden charges. You can borrow, lend, help, and offer services without ever paying to use the platform.",
  },
  {
    question:
      "What's the difference between casual help and professional services?",
    answer:
      "Casual help is when you help a neighbor occasionally - like pet sitting, moving assistance, or yard work. Professional services are skills you offer regularly as a business - like photography, web design, or tutoring. You can do both! Many neighbors offer casual help and professional services.",
  },
  {
    question: "How do trades and bartering work?",
    answer:
      "You and your neighbor agree on the exchange terms. Maybe you trade photography for tax help, or lend your pressure washer in exchange for homemade cookies. Cash, trade, barter, or free - you decide what works for each exchange.",
  },
  {
    question: "What if something I lend gets damaged?",
    answer:
      "Tribes encourages open communication and community accountability. Borrowers are expected to return items in the same condition (or replace/repair if damaged). Our rating system helps build trust, and you can always choose who to lend to based on their reputation.",
  },
  {
    question: "Can I offer professional services AND borrow items?",
    answer:
      "Absolutely! That's the whole point. You're not stuck in one category - you're a neighbor who might lend camping gear, need a ladder, and offer photography services all in the same week. Use Tribes however fits your needs.",
  },
  {
    question: "How do I know my neighbors are trustworthy?",
    answer:
      "Every neighbor is address-verified to ensure they actually live in your community. Ratings and reviews from past exchanges help you see who's reliable. Start with lower-stakes exchanges to build trust, and check reviews before lending valuable items.",
  },
];

export default function NeighborsPage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* Hero */}
        <section className="pt-[calc(70px+2rem)] pb-12 md:pt-[calc(70px+4rem)] md:pb-20 bg-gradient-to-br from-gray-50 to-offwhite">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-firefly leading-tight mb-6">
                  <span className="block">Your Neighborhood Has Everything.</span>
                  <span className="block">Tribes&#8482; Helps You Find It.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Borrow, lend, help, hire, trade - connect with neighbors who
                  have what you need and need what you have.
                </p>
                <Button href="#neighbors-cta" size="large">
                  Join the Waitlist
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  500+ neighbors already building their tribes
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://storage.googleapis.com/msgsndr/TEAVsvTerVipIS3cla4Y/media/69501f87dda1928d2295b863.jpeg"
                    alt="Colorful miniature houses on green hills representing a vibrant neighborhood community"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Use Cases — horizontal cards with left accent border */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-4">
                One Neighbor, Many Ways to Connect
              </h2>
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                You&apos;re not one type of user - you&apos;re a neighbor. Use
                Tribes&#8482; however fits your day.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {useCases.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1} className="h-full">
                  <div className="flex gap-4 bg-white rounded-lg shadow-sm p-6 h-full border-l-4 border-casablanca transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-firefly mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Categories — pill groups */}
        <section className="py-16 md:py-24 bg-granny">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-white text-center mb-12">
                Everything You Can Share, Borrow, and Offer
              </h2>
            </ScrollReveal>
            <div className="space-y-10">
              {categories.map((cat, i) => (
                <ScrollReveal key={cat.title} delay={i * 0.1}>
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                      {cat.title}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-[600px] mx-auto">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-firefly bg-white text-firefly text-base font-semibold transition-all duration-300 hover:bg-firefly hover:text-white hover:-translate-y-0.5"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="max-w-[900px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                How It Works
              </h2>
            </ScrollReveal>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <ScrollReveal key={step.number} delay={i * 0.1}>
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-casablanca text-firefly font-bold flex items-center justify-center text-lg">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-firefly mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits — horizontal cards with icon circle */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                Why Neighbors Love Tribes&#8482;
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08} className="h-full">
                  <div className="flex gap-4 bg-white rounded-lg shadow-sm p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="shrink-0 w-10 h-10 bg-casablanca rounded-full flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-firefly mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 md:py-24 bg-granny">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-white text-center mb-12">
                Meet Jamie: A Typical Tribes Neighbor
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                {testimonial.quotes.map((q, i) => (
                  <p key={i} className="text-gray-700 mb-4 leading-relaxed">
                    {q}
                  </p>
                ))}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-firefly">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {testimonial.stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-2xl font-bold text-casablanca">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {stat.label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Trust — horizontal cards with icon */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                Built for Trust
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustFeatures.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1} className="h-full">
                  <div className="flex gap-4 items-start bg-white rounded-lg shadow-sm p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="shrink-0 w-10 h-10 bg-casablanca rounded-full flex items-center justify-center text-lg font-bold text-firefly">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-firefly mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24">
          <div className="max-w-[800px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                Common Questions
              </h2>
            </ScrollReveal>
            <ClientFAQ items={faqItems} />
          </div>
        </section>

        {/* CTA */}
        <section
          id="neighbors-cta"
          className="py-16 md:py-24 bg-firefly text-white"
        >
          <div className="max-w-[600px] mx-auto px-4 text-center">
            <ScrollReveal>
              <GHLForm />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg mt-8">
                <span className="font-bold text-casablanca">500+</span>{" "}
                neighbors already building their tribes
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
