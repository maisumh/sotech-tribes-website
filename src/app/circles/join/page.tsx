import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Join a Circle | Tribes",
  description:
    "You've been invited to a Circle on Tribes. Open this link on your phone with the Tribes app installed.",
  robots: { index: false, follow: false },
};

/**
 * Web fallback for the Circle-invite universal link
 * (https://trytribes.com/circles/join?code=…). On a phone with the Tribes
 * app installed, iOS opens the app directly (Associated Domains — this page
 * never renders). Anyone else lands here: show the code for manual entry
 * and explain the invite-only state.
 */
export default async function CircleJoinFallback({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-firefly px-6 py-16 text-center">
      <Image
        src="/tribes-logo-white.png"
        alt="Tribes"
        width={140}
        height={40}
        className="mb-12 h-auto w-[140px]"
        priority
      />

      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/60">
        · Tribes · Circles
      </p>

      <h1
        className="mb-6 font-extralight text-white"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1 }}
      >
        You&rsquo;re{" "}
        <em className="font-light not-italic text-casablanca">invited.</em>
      </h1>

      <p className="mb-10 max-w-md font-light text-white/80">
        This invitation opens in the Tribes app. Open this link on your phone
        with Tribes installed and you&rsquo;ll land right in the Circle.
      </p>

      {code ? (
        <div className="mb-10 rounded-2xl border border-white/15 px-8 py-6">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">
            Your invite code
          </p>
          <p className="font-mono text-2xl tracking-[0.3em] text-casablanca">
            {code}
          </p>
          <p className="mt-3 text-sm font-light text-white/60">
            In the app: Circles → Join with a code
          </p>
        </div>
      ) : null}

      <p className="max-w-md text-sm font-light text-white/60">
        Don&rsquo;t have the app yet? Tribes is currently in invite-only early
        access. Ask the neighbor who invited you, or write to{" "}
        <a
          href="mailto:info@trytribes.com"
          className="text-casablanca underline-offset-4 hover:underline"
        >
          info@trytribes.com
        </a>
        .
      </p>
    </main>
  );
}
