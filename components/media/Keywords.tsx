import { Tag } from "lucide-react";

export function Keywords({ keywords }: { keywords: string[] }) {
  if (keywords.length === 0) return null;
  return (
    <section aria-labelledby="keywords-heading" className="space-y-3">
      <h2 id="keywords-heading" className="flex items-center gap-2 text-lg font-bold text-text">
        <Tag className="h-5 w-5 text-muted" /> Keywords
      </h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-white/10 bg-surface px-3 py-1 text-xs text-muted"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
