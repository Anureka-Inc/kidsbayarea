import { Link } from "@/i18n/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  gradient: string;
}

export default function CategoryCard({
  href,
  icon: Icon,
  title,
  description,
  cta,
  gradient,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600"
    >
      <div className={`mb-4 inline-flex rounded-xl p-3 ${gradient}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {description}
      </p>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition-colors group-hover:text-teal-500 dark:text-teal-400">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
