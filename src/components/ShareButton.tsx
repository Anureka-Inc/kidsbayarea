"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const shareText = text || "";

    // Use Web Share API when available
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-teal-300 hover:text-teal-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-teal-500 dark:hover:text-teal-400"
        aria-label="Share"
      >
        {copied ? (
          <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
      </button>

      {/* Toast feedback */}
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg dark:bg-gray-700">
          {t("linkCopied")}
        </div>
      )}
    </div>
  );
}
