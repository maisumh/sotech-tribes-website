import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const LAST_UPDATED = "April 15, 2026";
const CONTACT_EMAIL = "info@trytribes.com";

// TODO: Confirm Tribes' exact legal entity name and state of formation before
// app-store submission. Defaulted to Texas (HQ = Houston). If Tribes is
// organized elsewhere (e.g., Delaware), update GOVERNING_STATE here and the
// operator language in "Accepting these terms" below.
const GOVERNING_STATE = "Texas";

export const metadata: Metadata = {
  title: "Terms of Service | Tribes™",
  description:
    "The rules for using Tribes. Written in plain English. Covers eligibility, community guidelines, trades, arbitration, and more.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
                Terms
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-firefly/30">
                of Service
              </span>
            </div>
            <h1
              className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em] mb-6 animate-hero-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              The rules of<br />
              <em className="font-light not-italic text-casablanca">the road.</em>
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 leading-[1.6] max-w-xl mb-6 animate-hero-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              The agreement between you and Tribes. Worth reading — especially the section on arbitration and disputes.
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
                    <li>You must be 18+ to use Tribes.</li>
                    <li>Tribes is a platform. We help you find neighbors, but we are not a party to your trades.</li>
                    <li>Meet in public, trust your instincts, and only trade things you&rsquo;re allowed to trade.</li>
                    <li>Treat other neighbors well. No harassment, illegal items, or spam.</li>
                    <li>Disputes go to individual arbitration, not court or class action, unless you opt out within 30 days.</li>
                  </ul>
                </div>

                <h2>1. Accepting these terms</h2>
                <p>
                  These Terms of Service (the &ldquo;Terms&rdquo;) are a legal agreement between you and <strong>Tribes</strong>, a company based in Houston, Texas (&ldquo;Tribes,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). By creating an account, downloading our app, or using our website or services (together, the &ldquo;Service&rdquo;), you agree to these Terms and to our <Link href="/privacy">Privacy Policy</Link>. If you don&rsquo;t agree, please don&rsquo;t use the Service.
                </p>

                <h2>2. Who can use Tribes</h2>
                <p>You may use Tribes only if:</p>
                <ul>
                  <li>You are at least <strong>18 years old</strong>.</li>
                  <li>You can form a binding contract with us under the law of the place where you live.</li>
                  <li>You aren&rsquo;t barred from using the Service under US law or the law of any country where we operate.</li>
                  <li>You haven&rsquo;t been previously banned by Tribes.</li>
                </ul>
                <p>One account per person. You agree to keep the information in your account accurate, complete, and up to date.</p>

                <h2>3. Your account</h2>
                <p>
                  You&rsquo;re responsible for keeping your login credentials safe and for everything that happens under your account. Don&rsquo;t share your password. If you think someone else has accessed your account, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> right away.
                </p>

                <h2>4. How Tribes works</h2>
                <p>Tribes is a community where neighbors list goods and services they&rsquo;re <em>Offering</em> and goods and services they&rsquo;re <em>Seeking</em>. Our matching engine surfaces two-way trades with people nearby. You can then message one another inside the app, agree on terms, and meet to make the exchange. Tribes itself is free to use, and no money changes hands through the Service.</p>

                <h2>5. Your content</h2>
                <p>You own the photos, descriptions, messages, and other content you post (&ldquo;Your Content&rdquo;). By posting Your Content to Tribes, you grant us a worldwide, non-exclusive, royalty-free license to host, display, reproduce, adapt, and distribute it for the purpose of operating, improving, and promoting the Service. This license ends when you delete Your Content, except for reasonable archival copies and content that other users have already shared or relied on.</p>
                <p>You promise that Your Content is yours to share, that it doesn&rsquo;t violate anyone else&rsquo;s rights, and that it doesn&rsquo;t break these Terms. We may remove any content that we reasonably believe violates these Terms or our Community Guidelines, or that we think is unlawful, offensive, or harmful.</p>

                <h2>6. Community guidelines and acceptable use</h2>
                <p>Tribes only works if everyone looks out for each other. When you use the Service, you agree <strong>not</strong> to:</p>
                <ul>
                  <li>Harass, threaten, stalk, dox, or discriminate against anyone.</li>
                  <li>Post sexual content, nudity, hate speech, or violent or graphic material.</li>
                  <li>Post fake, misleading, or duplicate listings.</li>
                  <li>Spam other users or use the Service to send commercial messages unrelated to trading.</li>
                  <li>Ask for or send personal contact details (phone, address, social handles) <em>before</em> a match is made.</li>
                  <li>Try to take trades off the platform to avoid our rating or reporting systems.</li>
                  <li>Scrape, reverse-engineer, or abuse the Service technically.</li>
                  <li>Use bots, scripts, or automated tools to create accounts or post listings.</li>
                  <li>Impersonate anyone else, including Tribes staff.</li>
                  <li>Do anything that would violate Apple&rsquo;s or Google&rsquo;s app store rules.</li>
                </ul>

                <h2>7. Prohibited items and services</h2>
                <p>Some things simply can&rsquo;t be listed on Tribes. You agree not to offer, trade, or request:</p>
                <ul>
                  <li>Illegal drugs, controlled substances, or drug paraphernalia.</li>
                  <li>Weapons, firearms, ammunition, explosives, or tactical gear.</li>
                  <li>Stolen goods or anything you don&rsquo;t have the legal right to give away.</li>
                  <li>Live animals, livestock, or animal products regulated by law.</li>
                  <li>Alcohol, tobacco, vaping products, or any age-restricted substance.</li>
                  <li>Prescription medications, medical devices requiring a prescription, or human biological material.</li>
                  <li>Counterfeit, pirated, or knock-off goods.</li>
                  <li>Sexual services or anything that could reasonably be considered adult content.</li>
                  <li>Financial products, investments, or money-transfer services.</li>
                  <li>Recalled products or anything unsafe.</li>
                  <li>Anything else prohibited by US federal, state, or local law.</li>
                </ul>
                <p>We may remove listings, suspend your account, or report you to the authorities if you try to.</p>

                <h2>8. Trades, exchanges, and meeting in person</h2>
                <p>Tribes gives you tools to find each other. Everything that happens <em>after</em> a match — your conversation, your agreement, your exchange — is between you and the other person.</p>
                <p><strong>We do not verify the identity, background, or character of Tribes users.</strong> We don&rsquo;t inspect or guarantee the condition, safety, or legality of items or services. We don&rsquo;t broker trades or hold anything in escrow, and we aren&rsquo;t responsible for whether a trade completes the way you expected.</p>
                <p>Please trade responsibly. We strongly recommend that you:</p>
                <ul>
                  <li>Meet in a public, well-lit place. Many police stations have designated &ldquo;community exchange&rdquo; spots.</li>
                  <li>Bring a friend the first time you meet someone.</li>
                  <li>Tell someone you trust where you&rsquo;re going.</li>
                  <li>Walk away from anything that feels off, and report it in the app.</li>
                  <li>Never share financial information, government IDs, or passwords.</li>
                </ul>
                <p>You use the Service &mdash; including any in-person meeting &mdash; at your own risk.</p>

                <h2>9. Ratings and reputation</h2>
                <p>After a trade you can rate the other person. Ratings are opinions and we don&rsquo;t endorse them. We may remove ratings that are fake, abusive, or posted in bad faith, and we may suspend accounts that try to manipulate the rating system.</p>

                <h2>10. Reporting and moderation</h2>
                <p>If you see a listing, message, or profile that breaks these Terms, use the in-app report tool. We&rsquo;ll review reports and take action where appropriate — including warnings, removing content, suspending accounts, and banning users in serious cases. We try to be fair and consistent, but we may act without notice when safety or legal compliance requires it.</p>

                <h2>11. Copyright (DMCA)</h2>
                <p>We respect copyright. If you believe content on Tribes infringes your copyright, please send a notice to our designated agent that includes: (a) your physical or electronic signature; (b) identification of the copyrighted work you claim has been infringed; (c) identification of the material you want removed, with enough detail for us to find it; (d) your contact information; (e) a statement that you have a good-faith belief that the use isn&rsquo;t authorized by the copyright owner, its agent, or the law; and (f) a statement, under penalty of perjury, that the information in your notice is accurate and that you are the owner or authorized to act on the owner&rsquo;s behalf.</p>
                <p>
                  Send notices to: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the subject line <em>&ldquo;DMCA Notice.&rdquo;</em>
                </p>
                <p>We may terminate the accounts of repeat infringers. If you believe content was removed in error, you can send a counter-notice to the same email.</p>

                <h2>12. Suspension and termination</h2>
                <p>We may suspend or terminate your access to the Service at any time if you violate these Terms, put other users at risk, or use the Service in a way that exposes us to legal liability. You can delete your account at any time from inside the app. Sections that by their nature should survive termination will survive — including the licenses you&rsquo;ve granted, disclaimers, limitations of liability, indemnification, and dispute resolution.</p>

                <h2>13. Apple App Store additional terms</h2>
                <p>If you downloaded Tribes from the Apple App Store, these terms also apply:</p>
                <ul>
                  <li>These Terms are between you and Tribes only, not with Apple. Apple is not responsible for the app or its content.</li>
                  <li>Your license to use the app on an Apple device is limited to the terms of the Apple Media Services Terms and Conditions.</li>
                  <li>Apple has no obligation to provide any maintenance or support for the app.</li>
                  <li>If the app fails to conform to any applicable warranty, you may notify Apple and Apple will refund the purchase price (currently $0 because Tribes is free). To the maximum extent permitted by law, Apple has no other warranty obligation with respect to the app.</li>
                  <li>Tribes, not Apple, is responsible for addressing any claims by you or any third party relating to the app, including product liability claims, claims that the app fails to conform to any legal or regulatory requirement, and claims arising under consumer protection or similar laws.</li>
                  <li>If a third party claims the app or your use of it infringes their intellectual property rights, Tribes (not Apple) is responsible for investigating, defending, settling, and discharging any such claim.</li>
                  <li>You confirm that you are not located in a country subject to a US Government embargo, and that you are not on any US Government list of prohibited or restricted parties.</li>
                  <li><strong>Apple and Apple&rsquo;s subsidiaries are third-party beneficiaries of these Terms, and upon your acceptance Apple has the right to enforce them against you as a third-party beneficiary.</strong></li>
                </ul>

                <h2>14. Google Play additional terms</h2>
                <p>If you downloaded Tribes from the Google Play Store, you also agree to Google Play&rsquo;s Terms of Service. These Terms govern your relationship with Tribes; Google isn&rsquo;t a party to them and isn&rsquo;t responsible for the app.</p>

                <h2>15. Disclaimers</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DON&rsquo;T WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT IT WILL MEET YOUR REQUIREMENTS, OR THAT ANY OTHER USER IS WHO THEY CLAIM TO BE OR WILL FOLLOW THROUGH ON A TRADE. ANY CONTENT YOU GET FROM THE SERVICE IS AT YOUR OWN RISK.
                </p>

                <h2>16. Limitation of liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRIBES (AND ITS OFFICERS, EMPLOYEES, AGENTS, AND SERVICE PROVIDERS) WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
                </p>
                <p>
                  OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER OF (a) ONE HUNDRED U.S. DOLLARS ($100) OR (b) THE TOTAL AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE EVENT THAT GAVE RISE TO THE CLAIM. BECAUSE TRIBES IS FREE, AMOUNT (b) IS CURRENTLY $0.
                </p>
                <p>Some jurisdictions don&rsquo;t allow the exclusion or limitation of certain damages, so these limits may not fully apply to you.</p>

                <h2>17. Indemnification</h2>
                <p>You agree to defend, indemnify, and hold harmless Tribes and its team from any claims, losses, liabilities, and costs (including reasonable attorney&rsquo;s fees) arising out of your use of the Service, Your Content, your violation of these Terms, or your interactions with other users.</p>

                <h2>18. Dispute resolution, arbitration, and class action waiver</h2>
                <p><strong>Please read this section carefully. It affects your legal rights.</strong></p>

                <h3>Informal resolution first</h3>
                <p>
                  If you have a dispute with us, we want a chance to resolve it without going to arbitration. Please email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with a detailed description and the relief you&rsquo;re looking for. We agree to try in good faith for at least <strong>60 days</strong> to work things out before either of us starts arbitration.
                </p>

                <h3>Binding individual arbitration</h3>
                <p>
                  If we can&rsquo;t resolve it, you and Tribes agree that any dispute arising out of or relating to these Terms or the Service will be resolved by <strong>binding individual arbitration</strong> administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. The arbitrator — not a court — will decide all issues, except that either party may bring an individual action in small-claims court if it qualifies. Arbitration will take place in the county where you live, or remotely by phone or video, at your option. The Federal Arbitration Act governs the interpretation and enforcement of this section.
                </p>

                <h3>No class actions</h3>
                <p>
                  <strong>You and Tribes agree to bring claims only in an individual capacity, not as a plaintiff or class member in any class, consolidated, or representative action.</strong> The arbitrator may not consolidate claims or preside over any form of class or representative proceeding. If this class-action waiver is found unenforceable, then the entire arbitration section will be null and void, but the rest of these Terms will still apply.
                </p>

                <h3>30-day right to opt out</h3>
                <p>
                  You can opt out of this arbitration agreement by emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> within <strong>30 days</strong> of first accepting these Terms, with the subject line <em>&ldquo;Arbitration Opt-Out&rdquo;</em> and including your full name, email associated with your Tribes account, and a clear statement that you want to opt out. Opting out does not affect any other part of these Terms.
                </p>

                <h2>19. Governing law and venue</h2>
                <p>
                  {/* TODO: Confirm state of incorporation before submission. Default to Texas (HQ). */}
                  These Terms and any dispute arising from them are governed by the laws of the State of {GOVERNING_STATE}, without regard to its conflict-of-law rules. For any dispute not subject to arbitration (including small-claims actions and requests for injunctive relief), you and Tribes agree to the exclusive jurisdiction of the state and federal courts located in {GOVERNING_STATE}.
                </p>

                <h2>20. Changes to these Terms</h2>
                <p>We may update these Terms from time to time. If the changes are material, we&rsquo;ll let you know by email and inside the app at least 7 days before they take effect. Your continued use of the Service after the changes become effective means you accept the new Terms. The &ldquo;Last updated&rdquo; date at the top of this page always reflects the current version.</p>

                <h2>21. General</h2>
                <p><strong>Entire agreement.</strong> These Terms and the Privacy Policy are the complete agreement between you and Tribes about the Service.</p>
                <p><strong>Severability.</strong> If a court finds any part of these Terms unenforceable, the rest will still apply.</p>
                <p><strong>No waiver.</strong> If we don&rsquo;t enforce a right immediately, we still have that right.</p>
                <p><strong>Assignment.</strong> You may not transfer your rights under these Terms without our written consent. We may transfer our rights (for example, in a merger or sale of assets).</p>
                <p><strong>Notices.</strong> We may send notices to the email address on your account or display them inside the app. Send any legal notices to us at the email below.</p>
                <p><strong>Contact.</strong> Questions about these Terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

                <p className="text-sm text-gray-500 mt-8">
                  Tribes · Houston, Texas, United States
                </p>
              </div>
            </ScrollReveal>

            {/* Back links */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-firefly underline hover:text-casablanca">Privacy Policy</Link>
              <Link href="/support" className="text-firefly underline hover:text-casablanca">Support</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
