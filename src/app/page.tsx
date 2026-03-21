import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ValueProp from "@/components/sections/ValueProp";
import TribeExamples from "@/components/sections/TribeExamples";
import Neighborhood from "@/components/sections/Neighborhood";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import OurPeople from "@/components/sections/OurPeople";
import TribeTypes from "@/components/sections/TribeTypes";
import Audiences from "@/components/sections/Audiences";
import Impact from "@/components/sections/Impact";
import FoundingMember from "@/components/sections/FoundingMember";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ValueProp />
        <TribeExamples />
        <Neighborhood />
        <HowItWorks />
        <Features />
        <OurPeople />
        <TribeTypes />
        <Audiences />
        <Impact />
        <FoundingMember />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
