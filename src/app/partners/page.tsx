import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import StoreBadges from "@/components/ui/StoreBadges";
import WaitlistForm from "@/components/ui/WaitlistForm";
import ClientFAQ from "@/components/ui/ClientFAQ";

export const metadata: Metadata = {
  title: "For Partners | Bring Your Community onto Tribes | Tribes™",
  description:
    "Bring your street, congregation, school or club onto Tribes as a Circle. Give your members a practical reason to help each other.",
  openGraph: {
    images: [{ url: "/og-partners.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og-partners.png"],
  },
};

const partnerTypes = [
  {
    title: "Community Leaders",
    subtitle: "HOA presidents, block captains, neighborhood associations",
    description:
      "Bring your neighborhood into a private Circle, invite your members, and give them a practical reason to help each other — borrowing, lending, and trading skills instead of just posting about it.",
  },
  {
    title: "Organizations",
    subtitle: "Churches, nonprofits, sustainability groups, community centers",
    description:
      "Create a Circle that aligns with your mission and give members practical ways to live your values — coordinating help, sharing resources, and building relationships through real action rather than announcements.",
  },
  {
    title: "Affiliates & Advocates",
    subtitle: "Local influencers, community advocates, brand ambassadors",
    description:
      "Spread the word where you already have a following and help the first Circles in your area get off the ground. We'll give you the material to do it and keep you close to what's coming next.",
  },
];

const caseStudies = [
  {
    icon: "🏘️",
    title: "Neighborhood Associations",
    description:
      "An HOA launched Tribes with 250 households and created sub-tribes for tool sharing, neighborhood watch, and social events. Within 30 days, they had 8 active tribes and tripled their newsletter engagement\u2014because they weren\u2019t just announcing, they were facilitating actual helping.",
  },
  {
    icon: "⛪",
    title: "Faith Communities",
    description:
      "A church created a Parish Care Tribe to coordinate meals, rides, and support for members in need. Members now build genuine relationships through service\u2014not just seeing each other on Sundays. They\u2019ve organized 23 meal trains and 15 coordinated rides in just 3 months.",
  },
  {
    icon: "🌱",
    title: "Sustainability Groups",
    description:
      "A sustainability organization launched a Tool Library Tribe and Zero Waste Tribe, helping members share equipment and reduce consumption. Members actively live sustainability values daily\u2014sharing, borrowing, and reducing waste together as a community.",
  },
];

const successStories = [
  {
    icon: "👥",
    title: "Community Leader Example",
    stats: [
      { value: "250", label: "Households" },
      { value: "8", label: "Active Tribes" },
      { value: "3x", label: "Newsletter Engagement" },
    ],
    quote:
      '"We launched Tribes with 250 households. Within 30 days, we had 8 active tribes. Our newsletter engagement tripled because we weren\'t just announcing\u2014we were facilitating actual helping." \u2014 Maria R., HOA President',
  },
  {
    icon: "⛪",
    title: "Organization Example",
    stats: [
      { value: "23", label: "Meal Trains" },
      { value: "15", label: "Rides Coordinated" },
      { value: "8", label: "Home Repairs" },
    ],
    quote:
      '"We created a Parish Care Tribe to coordinate support for members in need. Our members are building genuine relationships through service, not just seeing each other on Sundays." \u2014 Pastor Michael T., Grace Community Church',
  },
  {
    icon: "📱",
    title: "Affiliate Example",
    stats: [
      { value: "200+", label: "Users Recruited" },
      { value: "15", label: "Service Providers" },
      { value: "5K", label: "Followers Reached" },
    ],
    quote:
      '"As a local neighborhood blogger, I promoted Tribes to my 5,000 followers. The affiliate commissions are great, but what\'s better is watching tribes actually form and seeing my community get stronger." \u2014 Jennifer L., Community Advocate & Affiliate',
  },
];

const faqItems = [
  {
    question: "What's required from our team to launch Tribes?",
    answer:
      "Very little. Tribes is free for your members to download and use, so the main thing you provide is the invitation — telling your community it exists and getting the first handful of people listing. We'll help you plan that launch.",
  },
  {
    question: "How do we get residents or members to actually use it?",
    answer:
      "The pattern that works is starting with supply: get a first group of members to list a few things they're Offering before you open it up, so nobody arrives to an empty marketplace. From there, matches do the work — people come back because Tribes told them a specific neighbor wants a specific thing they have.",
  },
  {
    question: "What's the cost for our community or organization?",
    answer:
      "Nothing today. Tribes is free for your members, and joining a Circle is free. Creating and running your own Circle is coming to Tribes Premium — get in touch and we'll walk you through it before it launches.",
  },
  {
    question: "When can we create our own Circle?",
    answer:
      "Circle creation is coming to Tribes Premium. Joining a Circle is free and available now, and we're onboarding a small number of founding communities by hand in the meantime — get in touch and we'll set yours up with you.",
  },
  {
    question: "Does Tribes integrate with our existing systems?",
    answer:
      "Not yet — Tribes has no integrations or public API today. Members join a Circle with a link or a code, which works alongside whatever directory or mailing list you already run. Tell us what you use and we'll factor it into the roadmap.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* Hero */}
        <section className="pt-[calc(70px+2rem)] pb-12 md:pt-[calc(70px+4rem)] md:pb-20 bg-gradient-to-br from-gray-50 to-offwhite">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-firefly leading-tight mb-6 animate-hero-fade-up" style={{ animationDelay: "0.1s" }}>
                  <span className="block">Bring Your Community</span>
                  <span className="block">onto Tribes<sup>&#8482;</sup>.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed animate-hero-fade-up" style={{ animationDelay: "0.25s" }}>
                  Circles are private, invite-only groups inside Tribes &mdash; for a street,
                  a congregation, a school or a club. Members trade with people they
                  already know, and every match shows who they have in common.
                </p>
                <div className="flex justify-center md:justify-start animate-hero-fade-up" style={{ animationDelay: "0.4s" }}>
                  <Button href="#partner-cta" size="large">
                    Talk to Us
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4 animate-hero-fade-up" style={{ animationDelay: "0.55s" }}>
                  87% participation rate in active Tribes communities
                </p>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl animate-hero-fade-up" style={{ animationDelay: "0.3s" }}>
                <img
                  src="https://storage.googleapis.com/msgsndr/TEAVsvTerVipIS3cla4Y/media/69501f87ee104758ebe639bc.jpeg"
                  alt="Team celebrating partnership success with a high-five"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                Three Types of Partners
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerTypes.map((type, i) => (
                <ScrollReveal key={type.title} delay={i * 0.1} className="h-full">
                  <div className="bg-white rounded-xl shadow-sm p-8 h-full text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <h3 className="font-heading text-2xl font-bold text-firefly mb-1">
                      {type.title}
                    </h3>
                    <p className="text-base text-gray-600 mb-4">
                      {type.subtitle}
                    </p>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                How Communities Are Using Tribes
              </h2>
            </ScrollReveal>
            <div className="flex flex-col gap-8">
              {caseStudies.map((study, i) => (
                <ScrollReveal key={study.title} delay={i * 0.1}>
                  <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{study.icon}</span>
                      <h3 className="font-heading text-2xl font-bold text-firefly">
                        {study.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {study.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                Success Stories
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, i) => (
                <ScrollReveal key={story.title} delay={i * 0.1} className="h-full">
                  <div className="bg-white rounded-xl shadow-sm p-8 h-full text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="text-5xl mb-4">{story.icon}</div>
                    <h3 className="font-heading text-xl font-semibold text-firefly mb-4">
                      {story.title}
                    </h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {story.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-gray-50 rounded-lg p-4 text-center"
                        >
                          <p className="text-2xl font-bold text-casablanca mb-1">
                            {stat.value}
                          </p>
                          <p className="text-gray-600 text-xs">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm italic leading-relaxed pt-4 border-t border-gray-200">
                      {story.quote}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-gray-50">
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
          id="partner-cta"
          className="py-16 md:py-24 bg-firefly text-white"
        >
          <div className="max-w-[640px] mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-casablanca mb-4">
                Bring Your Community Onto Tribes
              </h2>
              <p className="text-white/90 leading-relaxed mb-8">
                Tell us about your community and we&rsquo;ll help you get the first
                Circle off the ground. Tribes is free for your members today.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="text-left">
                <WaitlistForm
                  variant="light"
                  defaultRole="partner"
                  formName="partners_enquiry"
                  submitLabel="Get in touch"
                  successKicker="Message received"
                  successHeading="Thanks — we'll be in touch."
                  successBody="We'll reach out to talk through your community and how to get the first Circle off the ground."
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-12 pt-8 border-t border-white/15">
                <p className="text-white/80 text-sm mb-5">
                  Want to see it first? Tribes is free on iOS and Android.
                </p>
                <StoreBadges location="partners_cta" align="center" />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
