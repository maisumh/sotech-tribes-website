import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const LAST_UPDATED = "April 15, 2026";
const CONTACT_EMAIL = "info@trytribes.com";

export const metadata: Metadata = {
  title: "Privacy Policy | Tribes™",
  description:
    "How Tribes collects, uses, and protects your information. Plain language, your rights under US state privacy laws, and how to reach us.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* Hero */}
        <section className="relative pt-[calc(70px+3rem)] pb-14 md:pt-[calc(70px+5rem)] md:pb-20 overflow-hidden bg-offwhite">
          <div
            aria-hidden="true"
            className="absolute top-[70px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-casablanca/30 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-casablanca/5 blur-3xl pointer-events-none"
          />
          <div className="relative max-w-[800px] mx-auto px-6 md:px-10">
            <div className="flex items-center gap-3 mb-8 animate-hero-fade-up" style={{ animationDelay: "0.05s" }}>
              <span className="block h-px w-10 bg-casablanca" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-casablanca">
                Privacy
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-firefly/30">
                Policy
              </span>
            </div>
            <h1
              className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em] mb-6 animate-hero-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              How we handle<br />
              <em className="font-light not-italic text-casablanca">your data.</em>
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 leading-[1.6] max-w-xl mb-6 animate-hero-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              Written in plain English. No tricks, no sale of your data, no surprises.
            </p>
            <p
              className="text-xs uppercase tracking-[0.25em] text-firefly/50 animate-hero-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              — Last updated {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-[800px] mx-auto px-4">
            <ScrollReveal>
              <div className="legal-content">

                {/* TL;DR */}
                <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-10 border-l-4 border-casablanca">
                  <h2 className="font-heading text-lg font-semibold text-firefly mb-3 !mt-0">The short version</h2>
                  <ul className="space-y-2 text-gray-700 text-base leading-relaxed list-disc pl-5">
                    <li>We collect only what Tribes needs to match you with neighbors, keep the community safe, and run the app.</li>
                    <li>We do not sell your personal information for money.</li>
                    <li>Your ZIP code is used to match you locally. We do not collect your GPS location.</li>
                    <li>You can access, correct, export, or delete your account at any time from inside the app.</li>
                    <li>Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="text-firefly underline hover:text-casablanca">{CONTACT_EMAIL}</a></li>
                  </ul>
                </div>

                <h2>1. Who we are</h2>
                <p>
                  Tribes is a hyperlocal barter app based in Houston, Texas (&ldquo;Tribes,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). This Privacy Policy explains what information we collect when you use our mobile apps, our website, and any related services (together, the &ldquo;Service&rdquo;), how we use it, and the choices you have. By using the Service you agree to the practices described here.
                </p>

                <h2>2. Information we collect</h2>

                <h3>Information you give us</h3>
                <ul>
                  <li><strong>Account information:</strong> email address, phone number (optional), date of birth (used to verify you are at least 18), and a hashed password. We never store your password in plain text.</li>
                  <li><strong>Profile information:</strong> display name, profile photo, and bio.</li>
                  <li><strong>Location:</strong> your ZIP code, which you provide yourself. We use it for hyperlocal matching. <strong>We do not collect GPS or precise device location.</strong></li>
                  <li><strong>Listings:</strong> titles, descriptions, photos, categories, and whether each listing is something you&rsquo;re <em>Offering</em> or something you&rsquo;re <em>Seeking</em>.</li>
                  <li><strong>Messages:</strong> in-app chat content between you and matched users. We may review messages when investigating a report or a safety issue.</li>
                  <li><strong>Trade activity:</strong> matches, accepted and declined offers, completed trades, and the ratings you give and receive. We derive a trust score from this activity.</li>
                  <li><strong>Support and feedback:</strong> anything you send us when you contact support.</li>
                </ul>

                <h3>Information collected automatically</h3>
                <ul>
                  <li><strong>Device and app data:</strong> device type, operating system, app version, crash logs, and diagnostic data.</li>
                  <li><strong>Usage data:</strong> in-app events (screens viewed, features used) through Google Analytics for Firebase, used to improve the product.</li>
                </ul>

                <h3>Information from partners</h3>
                {/* TODO: Confirm with the FlutterFlow build team that (a) Meta
                    SDK is wired for install-attribution, and (b) App Tracking
                    Transparency (ATT) is actually prompted on iOS before any
                    cross-app tracking. If ATT is not yet implemented, remove
                    the second sentence before shipping. */}
                <ul>
                  <li><strong>Marketing attribution:</strong> if you install Tribes after clicking one of our ads or links, our advertising partners (currently Meta and Google) may share an install event and a campaign identifier so we can measure which campaigns are working. On iOS, we only do this if you give us permission through Apple&rsquo;s App Tracking Transparency prompt.</li>
                </ul>

                <h2>3. How we use your information</h2>
                <p>We use the information above to:</p>
                <ul>
                  <li>Run our matching engine so you can find trades with neighbors nearby.</li>
                  <li>Send you push notifications and emails about matches, messages, and important account activity.</li>
                  <li>Verify you are 18 or older.</li>
                  <li>Moderate content, prevent fraud and abuse, and enforce our Terms.</li>
                  <li>Provide customer support.</li>
                  <li>Improve the product through analytics and research.</li>
                  <li>Measure the performance of our marketing campaigns.</li>
                  <li>Comply with legal obligations.</li>
                </ul>

                <h2>4. How we share information</h2>
                <p><strong>We do not sell your personal information for money.</strong> We share information only in the ways described below.</p>

                <h3>With other Tribes users</h3>
                <p>Other users can see your public profile, your listings, messages you send them, and ratings you give. Your email address, phone number, and date of birth are never shown to other users.</p>

                <h3>With our service providers (data processors)</h3>
                <p>We rely on a small number of vendors to run the Service. They process your data only on our instructions:</p>
                <ul>
                  <li><strong>Supabase</strong> — database and authentication (United States).</li>
                  <li><strong>Google Firebase</strong> — push notifications and product analytics (United States).</li>
                  <li><strong>Twilio SendGrid</strong> — transactional and marketing email (United States).</li>
                  <li><strong>Meta and Google</strong> — advertising measurement and attribution.</li>
                  <li><strong>Vercel</strong> — website and API hosting (United States).</li>
                </ul>

                <h3>For advertising and measurement</h3>
                <p>
                  When we run ads on Meta or Google, we share limited event data (such as an install event or campaign identifier) with those platforms so they can measure campaign performance. Under California and some other state privacy laws, this type of sharing is treated as a &ldquo;sale&rdquo; or &ldquo;share&rdquo; of personal information even though no money changes hands. You can opt out at any time — see <a href="#your-rights">Your rights</a> below.
                </p>

                <h3>For legal reasons or to protect the community</h3>
                <p>We may disclose information if we reasonably believe it is necessary to comply with a law, court order, or valid government request; to enforce our Terms; to prevent fraud, abuse, or imminent harm; or in connection with a merger, acquisition, or sale of assets (in which case we will notify you before your information is transferred).</p>

                <h3>With your consent</h3>
                <p>We&rsquo;ll share information in other ways if you ask us to.</p>

                <h2 id="your-rights">5. Your rights and choices</h2>
                <p>Inside the app you can always:</p>
                <ul>
                  <li>View and edit your profile and listings.</li>
                  <li>Request a copy of your data.</li>
                  <li>Delete your account.</li>
                  <li>Block or report another user.</li>
                  <li>Turn off push notifications in your device settings.</li>
                </ul>

                <h3>If you live in California (CCPA / CPRA)</h3>
                <p>You have the right to know what personal information we collect and how we use it; request a copy in a portable format; correct inaccurate information; delete your information; limit how we use sensitive personal information; and opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of your personal information for cross-context behavioral advertising. We will not discriminate against you for exercising any of these rights.</p>
                <p>
                  To opt out of sharing for advertising, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the subject <em>&ldquo;Do Not Sell or Share My Personal Information.&rdquo;</em> We also honor the <strong>Global Privacy Control</strong> signal when sent from a supported browser on our website.
                </p>
                <p>
                  Once Tribes is live, the CCPA categories we will collect are: identifiers (email, phone, user ID), customer records (name, profile photo), commercial information (listings, trades), internet/network activity, geolocation (ZIP-level only), and inferences (trust score). We will disclose identifiers and internet activity to our advertising partners for measurement. We do not sell personal information for monetary value.
                </p>

                <h3>If you live in Texas (TDPSA)</h3>
                <p>Texas residents have the right to confirm whether we process their personal data, access it, correct it, delete it, obtain a portable copy, and opt out of targeted advertising, the sale of personal data, and certain profiling. If we decline your request, you can appeal by replying to our decision email.</p>

                <h3>If you live in another US state with a privacy law</h3>
                <p>Residents of Virginia, Colorado, Connecticut, Utah, Oregon, Montana, Iowa, Delaware, New Hampshire, New Jersey, Tennessee, Minnesota, Maryland, Indiana, Kentucky, and Rhode Island have rights similar to those described above, subject to their local law. We will honor any valid request from a resident of those states using the same process.</p>

                <h3>If you live in the European Economic Area or the United Kingdom</h3>
                <p>The Service is offered to users in the United States. If you access it from outside the US, you have the rights granted by your local law, including access, rectification, erasure, restriction, portability, and the right to object to processing. Contact us using the details below to exercise those rights.</p>

                <h3>How to exercise your rights</h3>
                <p>Most rights can be handled inside the app. For anything else, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 45 days. We may ask you to verify your identity before acting on a request. You may also designate an authorized agent to make a request on your behalf.</p>

                <h2>6. Account deletion</h2>
                <p>You can delete your Tribes account from inside the app at any time. Deleting your account removes your profile, listings, and rating history from the app. We retain a limited copy of your account data for up to 90 days for fraud prevention, legal compliance, and safety investigations, after which it is permanently deleted. Messages you sent to other users may remain in their inboxes.</p>

                <h2>7. Data retention</h2>
                <p>We keep personal information only as long as we need it. Specifically:</p>
                <ul>
                  <li><strong>Account and profile:</strong> while your account is active, and up to 90 days after deletion.</li>
                  <li><strong>Listings and messages:</strong> while your account is active, and up to 90 days after deletion.</li>
                  <li><strong>Trade history and ratings:</strong> retained in aggregated/anonymized form to protect other users&rsquo; reputations.</li>
                  <li><strong>Support emails:</strong> up to two years.</li>
                  <li><strong>Legal and tax records:</strong> as required by law.</li>
                </ul>

                <h2>8. Data security</h2>
                <p>We use industry-standard measures to protect your information. Data is encrypted in transit (TLS) and at rest, passwords are stored as one-way hashes, access to production systems is limited, and we maintain reporting and blocking tools inside the app so the community can flag abuse. No system is perfectly secure, but we work hard to keep yours safe.</p>

                <h2>9. Children&rsquo;s privacy</h2>
                <p>Tribes is intended for adults. You must be at least 18 years old to create an account. We do not knowingly collect personal information from anyone under 13. If you believe a child under 13 has given us information, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will delete it.</p>

                <h2>10. International data transfers</h2>
                <p>Tribes is operated from the United States and your information is processed here. If you access the Service from outside the US, you understand that your information will be transferred to, stored, and processed in the United States.</p>

                <h2>11. Cookies and similar technologies on our website</h2>
                <p>Our website uses a small number of essential first-party cookies needed to run the site. When we turn on analytics or advertising cookies (for example, Google Analytics or Meta Pixel, to understand how the site is used and to measure our marketing), we&rsquo;ll update this policy before they start collecting data. You can disable cookies in your browser settings, and we honor the Global Privacy Control signal as described above. The mobile app does not use web cookies.</p>

                <h2>12. Changes to this policy</h2>
                <p>We&rsquo;ll update this page when our practices change. If the change is material, we&rsquo;ll notify you by email and inside the app at least 7 days before it takes effect. The &ldquo;Last updated&rdquo; date at the top of this page always reflects the current version.</p>

                <h2>13. Contact</h2>
                <p>
                  Questions, requests, or complaints about this policy? Email{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
                <p className="text-sm text-gray-500 mt-8">
                  Tribes · Houston, Texas, United States
                </p>
              </div>
            </ScrollReveal>

            {/* Back links */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
              <Link href="/terms" className="text-firefly underline hover:text-casablanca">Terms of Service</Link>
              <Link href="/support" className="text-firefly underline hover:text-casablanca">Support</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
