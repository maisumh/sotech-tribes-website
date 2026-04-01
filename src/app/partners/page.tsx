import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import GHLForm from "@/components/ui/GHLForm";
import ClientFAQ from "@/components/ui/ClientFAQ";

export const metadata: Metadata = {
  title: "For Partners | Launch & Manage Community Tribes | Tribes™",
  description:
    "Launch branded tribes, activate your members, and scale real community impact.",
};

const partnerTypes = [
  {
    title: "Community Leaders",
    subtitle: "HOA presidents, block captains, neighborhood associations",
    description:
      "Launch and manage official tribes for your neighborhood. Organize members, create interest-based sub-tribes, and track community engagement with powerful admin tools and analytics.",
  },
  {
    title: "Organizations",
    subtitle: "Churches, nonprofits, sustainability groups, community centers",
    description:
      "Create tribes that align with your mission and give members practical ways to live your values. Facilitate mutual support, resource sharing, and strengthen relationships through meaningful action.",
  },
  {
    title: "Affiliates & Advocates",
    subtitle: "Local influencers, community advocates, brand ambassadors",
    description:
      "Promote Tribes in your community and help new tribes form and thrive. Earn commissions for active members you recruit while building your local influence and making a real impact.",
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
      "Minimal time investment from your team. We handle setup, training, and provide all promotional materials. You'll need to communicate the launch to residents (we provide templates) and designate 1-2 community moderators. Most communities are fully launched within 4 weeks.",
  },
  {
    question: "How do we get residents or members to actually use it?",
    answer:
      'We\'ve developed proven activation strategies: identify and activate community champions, create 3-5 "seed tribes" that solve real problems (tool sharing, parents, pets), incentivize early adopters, and maintain consistent communication. Communities that follow our playbook see 70-90% participation within 3 months.',
  },
  {
    question: "What's the cost for our community or organization?",
    answer:
      "Pricing varies by community size and needs. Contact us for a customized quote. We offer tiered pricing that makes Tribes accessible for communities of all sizes. Individual residents and members always use Tribes for free.",
  },
  {
    question: "How do affiliates earn commissions?",
    answer:
      "Affiliates earn commissions based on active users and service providers they recruit through unique referral links. We track signups and ongoing engagement, rewarding you for bringing valuable members to the platform. Details are provided when you join the affiliate program.",
  },
  {
    question: "Can Tribes integrate with our existing systems?",
    answer:
      "Yes. We can integrate with common management platforms, resident directories, and communication tools. We also provide APIs for custom integrations. During onboarding, we'll discuss your specific tech stack and integration needs.",
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
              <ScrollReveal>
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-firefly leading-tight mb-6">
                  <span className="block">Build Tribes&#8482;.</span>
                  <span className="block">Activate Communities.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Launch branded tribes, activate your members, and scale real
                  community impact.
                </p>
                <Button href="#partner-cta" size="large">
                  Join the Waitlist
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  87% participation rate in active Tribes communities
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://storage.googleapis.com/msgsndr/TEAVsvTerVipIS3cla4Y/media/69501f87ee104758ebe639bc.jpeg"
                    alt="Team celebrating partnership success with a high-five"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
                Three Types of Partners
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerTypes.map((type, i) => (
                <ScrollReveal key={type.title} delay={i * 0.1} className="h-full">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="bg-gray-50 px-8 py-6 text-center">
                      <h3 className="font-heading text-2xl font-bold text-firefly">
                        {type.title}
                      </h3>
                      <p className="text-base text-gray-600 mt-1">
                        {type.subtitle}
                      </p>
                    </div>
                    <div className="px-8 py-6">
                      <p className="text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 md:py-24 bg-granny">
          <div className="max-w-[1200px] mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-white text-center mb-12">
                How Communities Are Using Tribes
              </h2>
            </ScrollReveal>
            <div className="flex flex-col gap-8 max-w-[900px] mx-auto">
              {caseStudies.map((study, i) => (
                <ScrollReveal key={study.title} delay={i * 0.1}>
                  <div className="bg-white border-2 border-firefly rounded-xl p-8 transition-all duration-300 hover:bg-firefly hover:-translate-y-1 hover:shadow-lg hover:shadow-firefly/25 group">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl group-hover:opacity-90 transition-opacity">{study.icon}</span>
                      <h3 className="font-heading text-2xl font-bold text-firefly group-hover:text-white transition-colors">
                        {study.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed group-hover:text-white/80 transition-colors">
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
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{story.icon}</span>
                      <h3 className="font-heading text-lg font-semibold text-firefly">
                        {story.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {story.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-gray-50 rounded-lg p-4 text-center"
                        >
                          <p className="text-xl font-bold text-casablanca">
                            {stat.value}
                          </p>
                          <p className="text-gray-600 text-sm">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm italic leading-relaxed">
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
          <div className="max-w-[600px] mx-auto px-4 text-center">
            <ScrollReveal>
              <GHLForm />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg mt-8">
                <span className="font-bold text-casablanca">
                  Build movements
                </span>{" "}
                and activate communities at scale
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
