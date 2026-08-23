import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import FeedbackForm from "@/components/ui/FeedbackForm";

export const metadata: Metadata = {
  title: "Share Feedback | Tribes",
  description: "Tell us what you think. Your feedback shapes Tribes.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  user_id?: string;
  email?: string;
  version?: string;
}>;

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user_id, email, version } = await searchParams;

  return (
    <div className="min-h-screen bg-firefly flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 flex justify-center">
        <Link href="/" aria-label="Tribes home">
          <Image
            src={BRAND.logos.primaryWhite}
            alt="Tribes"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-16">
        <div className="w-full max-w-[640px]">
          <div className="text-center mb-8 px-2">
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
              Shape Tribes with us.
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              Every answer you give lands in front of the team the same day.
              Even "I don't get it" is gold. That's exactly why we're asking.
            </p>
          </div>

          <div className="bg-offwhite rounded-2xl shadow-2xl p-4 md:p-8">
            <FeedbackForm
              userId={user_id}
              email={email}
              appVersion={version}
            />
          </div>

          <p className="text-center text-white/60 text-sm mt-6">
            Thank you for being part of the first tribe.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center border-t border-white/10">
        <a
          href="https://trytribes.com"
          className="text-casablanca font-semibold text-sm hover:underline"
        >
          trytribes.com
        </a>
      </footer>
    </div>
  );
}
