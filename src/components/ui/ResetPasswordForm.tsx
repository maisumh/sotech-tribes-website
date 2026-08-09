"use client";

/**
 * Password-reset handler — consumes a Supabase recovery link and sets a new password.
 *
 * Why this lives on the web and not in the app: the reset link has to work
 * wherever the email is opened, which is very often a desktop browser rather
 * than the phone that requested it. A custom-scheme link (`tribesapp://…`)
 * silently does nothing there. This page works everywhere and needs no app
 * release to change.
 *
 * Flow: Supabase verifies the emailed token, then redirects here with the
 * session in the URL **fragment** (implicit flow — the mobile client does not
 * set `flowType: 'pkce'`, so there is no code_verifier to exchange and the
 * browser can complete the reset on its own).
 *
 * Deliberately uses a bare `createClient` with `persistSession: false` rather
 * than the shared `@/lib/supabase/client` browser client: that one is
 * cookie-backed via @supabase/ssr, and a recovery session for an ordinary user
 * has no business being written into cookies on the same domain as /admin.
 * Here the session lives in memory for exactly as long as the update takes.
 */

import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    // Matches the app's own rule (sign-up + Settings → Password both use 8).
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

type Phase =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "invalid"; message: string }
  | { kind: "success" };

const APP_SCHEME = "tribesapp://";

function supabaseForRecovery() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        // We parse the fragment ourselves so failures are explicit and
        // reportable rather than a silent no-op.
        detectSessionInUrl: false,
      },
    },
  );
}

const EXPIRED_MESSAGE =
  "This reset link has expired or has already been used. Request a new one from the app and open it within the hour.";

export default function ResetPasswordForm() {
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [serverError, setServerError] = useState<string | null>(null);
  // One client for the life of the page — it holds the recovery session.
  const clientRef = useRef<ReturnType<typeof supabaseForRecovery> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    // Supabase returns everything in the fragment, which never reaches the
    // server — so this has to run client-side.
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);

    const error = params.get("error_description") ?? params.get("error");
    if (error) {
      setPhase({ kind: "invalid", message: EXPIRED_MESSAGE });
      return;
    }

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setPhase({
        kind: "invalid",
        message:
          "This page needs a valid reset link. Open the link we emailed you, or request a new one from the Tribes app.",
      });
      return;
    }

    const client = supabaseForRecovery();
    clientRef.current = client;

    client.auth
      .setSession({ access_token, refresh_token })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setPhase({ kind: "invalid", message: EXPIRED_MESSAGE });
          return;
        }
        setPhase({ kind: "ready" });
      })
      .catch(() => {
        setPhase({
          kind: "invalid",
          message:
            "We couldn’t reach the server. Check your connection and open the link again.",
        });
      });

    // Strip the tokens out of the address bar so they don't sit in history
    // or leak via a shared/screenshotted URL.
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  async function onSubmit(values: FormValues) {
    const client = clientRef.current;
    if (!client) {
      setPhase({ kind: "invalid", message: EXPIRED_MESSAGE });
      return;
    }

    setServerError(null);
    const { error } = await client.auth.updateUser({ password: values.password });

    if (error) {
      // A recovery session is short-lived; if it lapsed mid-form say so plainly
      // rather than showing a raw auth error.
      const expired = /expired|invalid|jwt|session/i.test(error.message);
      if (expired) {
        setPhase({ kind: "invalid", message: EXPIRED_MESSAGE });
        return;
      }
      setServerError(error.message || "Could not update your password. Please try again.");
      return;
    }

    // Don't leave a live session sitting in the tab.
    await client.auth.signOut().catch(() => {});
    setPhase({ kind: "success" });
  }

  const labelClass =
    "block text-[11px] uppercase tracking-[0.2em] font-semibold text-firefly/70 mb-3";
  const inputClass =
    "w-full bg-transparent border-0 border-b border-firefly/20 px-0 py-3 text-lg text-firefly placeholder-gray-400 focus:border-casablanca focus:outline-none focus:ring-0 transition-colors min-h-[44px]";
  const errorClass = "mt-2 text-xs text-red-600 tracking-wide";

  if (phase.kind === "loading") {
    return (
      <p className="text-gray-500 leading-relaxed" role="status">
        Checking your reset link&hellip;
      </p>
    );
  }

  if (phase.kind === "invalid") {
    return (
      <div>
        <div className="border-l-2 border-casablanca bg-casablanca/5 px-5 py-4 text-firefly leading-relaxed">
          {phase.message}
        </div>
        <p className="mt-8 text-sm text-gray-500 leading-relaxed">
          Open Tribes, tap <strong className="text-firefly">Sign in</strong>, then{" "}
          <strong className="text-firefly">Forgot password</strong> to send yourself a fresh
          link. Still stuck? Email{" "}
          <a
            href="mailto:info@trytribes.com?subject=Password%20reset%20help"
            className="text-firefly underline underline-offset-2 decoration-casablanca/50 hover:decoration-casablanca"
          >
            info@trytribes.com
          </a>
          .
        </p>
      </div>
    );
  }

  if (phase.kind === "success") {
    return (
      <div className="text-firefly">
        <div
          className="w-14 h-14 rounded-full border border-casablanca mb-6 flex items-center justify-center text-casablanca text-2xl"
          aria-hidden="true"
        >
          ✓
        </div>
        <div className="text-xs uppercase tracking-[0.35em] text-casablanca mb-3">
          Password updated
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-extralight mb-4 leading-tight">
          You&rsquo;re all set.
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-md">
          Open the Tribes app and sign in with your email and your new password.
        </p>
        <a
          href={APP_SCHEME}
          className="mt-8 inline-flex items-center justify-center gap-3 bg-casablanca text-firefly font-semibold px-10 py-4 rounded-full min-h-[52px] text-sm uppercase tracking-[0.2em] transition-all hover:bg-casablanca-dark hover:shadow-xl hover:shadow-casablanca/30 hover:-translate-y-0.5"
        >
          <span>Open Tribes</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div>
        <label htmlFor="rp-password" className={labelClass}>
          New password
        </label>
        <input
          id="rp-password"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          aria-invalid={errors.password ? "true" : "false"}
          {...register("password")}
        />
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="rp-confirm" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="rp-confirm"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          aria-invalid={errors.confirm ? "true" : "false"}
          {...register("confirm")}
        />
        {errors.confirm && <p className={errorClass}>{errors.confirm.message}</p>}
      </div>

      {serverError && (
        <div className="border-l-2 border-red-500 bg-red-50/50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative inline-flex items-center justify-center gap-3 bg-casablanca text-firefly font-semibold px-10 py-4 rounded-full min-h-[52px] text-sm uppercase tracking-[0.2em] transition-all hover:bg-casablanca-dark hover:shadow-xl hover:shadow-casablanca/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none whitespace-nowrap"
      >
        <span>{isSubmitting ? "Saving..." : "Set new password"}</span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </button>
    </form>
  );
}
