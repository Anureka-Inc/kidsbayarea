"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSignup() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Store in localStorage for now; integrate with a real service later
    const existing = JSON.parse(localStorage.getItem("newsletter_emails") || "[]");
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem("newsletter_emails", JSON.stringify(existing));
    }

    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-8 sm:p-12 dark:border-teal-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative blob */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-700/20" />

        <div className="relative mx-auto max-w-xl text-center">
          <div className="mb-4 inline-flex rounded-xl bg-teal-100 p-3 dark:bg-teal-900/50">
            <Mail className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 rounded-xl bg-teal-50 p-4 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              <CheckCircle className="h-5 w-5 shrink-0" />
              {t("success")}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                aria-label={t("placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 outline-none backdrop-blur-sm transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:focus:border-teal-500 dark:focus:ring-teal-900"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                {t("subscribe")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
