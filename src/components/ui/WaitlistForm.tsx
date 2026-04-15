"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "5-digit US ZIP"),
  role: z.enum(["neighbor", "partner", "both"]),
});

type FormValues = z.infer<typeof schema>;

const roleOptions: Array<{ value: FormValues["role"]; label: string }> = [
  { value: "neighbor", label: "Neighbor" },
  { value: "partner", label: "Partner / organization" },
  { value: "both", label: "A bit of both" },
];

export default function WaitlistForm({
  variant = "dark",
}: {
  /** "dark" sits on white card; "light" sits on firefly section */
  variant?: "dark" | "light";
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "neighbor" },
  });

  const currentRole = watch("role");

  async function onSubmit(values: FormValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Please try again");
    }
  }

  // Tokens that flip based on variant
  const isLight = variant === "light";
  const labelClass = isLight
    ? "block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-3"
    : "block text-[11px] uppercase tracking-[0.2em] font-semibold text-firefly/70 mb-3";
  const inputClass = isLight
    ? "w-full bg-transparent border-0 border-b border-white/25 px-0 py-3 text-lg text-white placeholder-white/40 focus:border-casablanca focus:outline-none focus:ring-0 transition-colors min-h-[44px]"
    : "w-full bg-transparent border-0 border-b border-firefly/20 px-0 py-3 text-lg text-firefly placeholder-gray-400 focus:border-casablanca focus:outline-none focus:ring-0 transition-colors min-h-[44px]";
  const errorClass = "mt-2 text-xs text-red-600 tracking-wide";
  const successBg = isLight ? "text-white" : "text-firefly";
  const successMuted = isLight ? "text-white/70" : "text-gray-600";

  if (status === "success") {
    return (
      <div className={`text-center py-12 md:py-16 px-6 ${successBg}`}>
        <div
          className="w-14 h-14 rounded-full border border-casablanca mx-auto mb-6 flex items-center justify-center text-casablanca text-2xl"
          aria-hidden="true"
        >
          ✓
        </div>
        <div className="text-xs uppercase tracking-[0.35em] text-casablanca mb-3">
          You&rsquo;re on the list
        </div>
        <h3 className="font-heading text-3xl md:text-4xl font-extralight mb-4 leading-tight">
          Welcome to the tribe.
        </h3>
        <p className={`${successMuted} max-w-md mx-auto leading-relaxed`}>
          We&rsquo;ll reach out when Tribes opens in your area. Keep an eye on your inbox.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={`mt-8 text-sm uppercase tracking-[0.2em] ${isLight ? "text-white" : "text-firefly"} hover:text-casablanca transition-colors border-b border-casablanca/40 hover:border-casablanca pb-1`}
        >
          Sign up someone else
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:space-y-10" noValidate>
      <div className="grid md:grid-cols-2 gap-8 md:gap-10">
        <div>
          <label htmlFor="wl-name" className={labelClass}>
            Your name
          </label>
          <input
            id="wl-name"
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-invalid={errors.name ? "true" : "false"}
            {...register("name")}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="wl-email" className={labelClass}>
            Email address
          </label>
          <input
            id="wl-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-10">
        <div>
          <label htmlFor="wl-zip" className={labelClass}>
            ZIP code
          </label>
          <input
            id="wl-zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            placeholder="77001"
            className={`${inputClass} tabular-nums`}
            aria-invalid={errors.zip ? "true" : "false"}
            {...register("zip")}
          />
          {errors.zip && <p className={errorClass}>{errors.zip.message}</p>}
        </div>

        <div>
          <div className={labelClass}>I am a</div>
          <div className="flex flex-wrap gap-2 pt-2">
            {roleOptions.map((opt) => {
              const selected = currentRole === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("role", opt.value, { shouldValidate: true })}
                  className={`px-5 py-2.5 rounded-full text-sm tracking-wide border transition-all ${
                    selected
                      ? "bg-casablanca border-casablanca text-firefly font-semibold"
                      : isLight
                        ? "border-white/30 text-white/80 hover:border-casablanca hover:text-white"
                        : "border-firefly/20 text-firefly/70 hover:border-casablanca hover:text-firefly"
                  }`}
                  aria-pressed={selected}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("role")} />
        </div>
      </div>

      {serverError && (
        <div className="border-l-2 border-red-500 bg-red-50/50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-4">
        <p className={`text-xs leading-relaxed max-w-md ${isLight ? "text-white/60" : "text-gray-500"}`}>
          By joining, you agree to our{" "}
          <a href="/privacy" className={`${isLight ? "text-white" : "text-firefly"} underline underline-offset-2 decoration-casablanca/50 hover:decoration-casablanca`}>
            Privacy Policy
          </a>
          . No spam, ever.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group relative inline-flex items-center justify-center gap-3 bg-casablanca text-firefly font-semibold px-10 py-4 rounded-full min-h-[52px] text-sm uppercase tracking-[0.2em] transition-all hover:bg-casablanca-dark hover:shadow-xl hover:shadow-casablanca/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none whitespace-nowrap"
        >
          <span>{status === "submitting" ? "Joining..." : "Join the waitlist"}</span>
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>
    </form>
  );
}
