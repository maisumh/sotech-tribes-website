import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResetPasswordForm from "@/components/ui/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Your Password | Tribes™",
  description: "Set a new password for your Tribes account.",
  // Utility page reached only from an emailed link — nothing to index.
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-white">
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-xl">
            <p className="text-sm uppercase tracking-widest text-firefly/60">
              · ACCOUNT · RESET
            </p>
            <h1
              className="mt-4 font-extralight text-firefly"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.05 }}
            >
              Set a new{" "}
              <em className="font-light not-italic text-casablanca">password</em>
            </h1>
            <p className="mt-6 text-gray-600 leading-relaxed">
              Choose a new password for your Tribes account. You&rsquo;ll use it next time
              you sign in with your email address.
            </p>

            <div className="mt-12">
              <ResetPasswordForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
