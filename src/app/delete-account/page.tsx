import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const CONTACT_EMAIL = "info@trytribes.com";

export const metadata: Metadata = {
  title: "Delete Your Account | Tribes™",
  description:
    "How to delete your Tribes account and associated data, in the app or by request.",
  robots: { index: true, follow: true },
};

export default function DeleteAccountPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-white">
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-firefly/60 text-center md:text-left">
              · ACCOUNT · DELETION
            </p>
            <h1
              className="mt-4 font-extralight text-firefly text-center md:text-left"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05 }}
            >
              Delete your{" "}
              <em className="font-light not-italic text-casablanca">account</em>
            </h1>
            <div className="legal-content mt-10">
              <h2>Delete in the app (fastest)</h2>
              <p>
                You can permanently delete your Tribes account and associated
                data directly in the app:
              </p>
              <ul>
                <li>Open Tribes and go to the <strong>Me</strong> tab</li>
                <li>Tap <strong>Settings</strong></li>
                <li>
                  Under <strong>Account</strong>, tap{" "}
                  <strong>Delete account</strong> and confirm
                </li>
              </ul>
              <p>
                Deletion is immediate. Your profile is anonymized, your listings
                and showcase items are removed, and your sign-in methods
                (including Sign in with Apple and Google) are revoked.
              </p>

              <h2>Request deletion by email</h2>
              <p>
                If you can&rsquo;t access the app, email{" "}
                <a href={`mailto:${CONTACT_EMAIL}?subject=Account%20deletion%20request`}>
                  {CONTACT_EMAIL}
                </a>{" "}
                from the email address associated with your account with the
                subject &ldquo;Account deletion request.&rdquo; We process
                requests within 30 days.
              </p>

              <h2>What is deleted, and what is kept</h2>
              <p>
                Deleting your account removes your profile information, listings,
                showcase items, and sign-in credentials. Chat threads you
                participated in are anonymized rather than removed from the other
                person&rsquo;s history. We may retain limited records where
                required for safety, fraud prevention, or legal compliance (for
                example, moderation reports), in de-identified form wherever
                possible.
              </p>
              <p>
                You can also delete individual listings, showcase items, and
                messages at any time in the app without deleting your account.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
