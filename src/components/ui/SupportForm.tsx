"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  category: z.enum(["account", "listing", "safety", "bug", "other"]),
  message: z.string().trim().min(10, "Please share a little more detail").max(5000, "Message is too long"),
});

type FormValues = z.infer<typeof schema>;

const categoryLabels: Record<FormValues["category"], string> = {
  account: "Account help",
  listing: "A listing or user",
  safety: "Safety concern",
  bug: "Bug report",
  other: "Something else",
};

export default function SupportForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: "other" },
  });

  async function onSubmit(values: FormValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/support", {
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

  if (status === "success") {
    return (
      <div className="text-center py-16 md:py-20 px-6">
        <div
          className="w-14 h-14 rounded-full border border-casablanca mx-auto mb-6 flex items-center justify-center text-casablanca text-2xl"
          aria-hidden="true"
        >
          ✓
        </div>
        <div className="text-xs uppercase tracking-[0.35em] text-casablanca mb-3">Thank you</div>
        <h3 className="font-heading text-3xl md:text-4xl font-extralight text-firefly mb-4 leading-tight">
          Message received.
        </h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          We&rsquo;ll respond within 2 business days. Keep an eye on your inbox for our reply.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm uppercase tracking-[0.2em] text-firefly hover:text-casablanca transition-colors border-b border-casablanca/40 hover:border-casablanca pb-1"
        >
          Send another
        </button>
      </div>
    );
  }

  const labelClass =
    "block text-[11px] uppercase tracking-[0.2em] font-semibold text-firefly/70 mb-3";
  const inputClass =
    "w-full bg-transparent border-0 border-b border-firefly/20 px-0 py-3 text-lg text-firefly placeholder-gray-400 focus:border-casablanca focus:outline-none focus:ring-0 transition-colors min-h-[44px]";
  const errorClass = "mt-2 text-xs text-red-600 tracking-wide";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:space-y-10" noValidate>
      <div className="grid md:grid-cols-2 gap-8 md:gap-10">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-invalid={errors.name ? "true" : "false"}
            {...register("name")}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          What&rsquo;s this about
        </label>
        <select
          id="category"
          className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22 fill=%22none%22><path d=%22M1 1.5L6 6.5L11 1.5%22 stroke=%22%23103730%22 stroke-width=%221.5%22 stroke-linecap=%22round%22/></svg>')] bg-no-repeat bg-[right_center] pr-8 cursor-pointer`}
          {...register("category")}
        >
          {(Object.keys(categoryLabels) as FormValues["category"][]).map((key) => (
            <option key={key} value={key}>
              {categoryLabels[key]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          How can we help
        </label>
        <textarea
          id="message"
          rows={4}
          className={`${inputClass} resize-y leading-relaxed`}
          placeholder="Tell us what&rsquo;s going on..."
          aria-invalid={errors.message ? "true" : "false"}
          {...register("message")}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      {serverError && (
        <div className="border-l-2 border-red-500 bg-red-50/50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-4">
        <p className="text-xs text-gray-500 leading-relaxed max-w-md">
          By submitting, you agree to our{" "}
          <a href="/privacy" className="text-firefly underline underline-offset-2 decoration-casablanca/50 hover:decoration-casablanca">
            Privacy Policy
          </a>
          . We respond within 2 business days.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group relative inline-flex items-center justify-center gap-3 bg-firefly text-white font-semibold px-10 py-4 rounded-full min-h-[52px] text-sm uppercase tracking-[0.2em] transition-all hover:bg-firefly-light hover:shadow-xl hover:shadow-firefly/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none whitespace-nowrap"
        >
          <span>{status === "submitting" ? "Sending..." : "Send message"}</span>
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
