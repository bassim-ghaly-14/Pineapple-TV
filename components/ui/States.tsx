import Link from "next/link";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryHref,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-white/5 bg-surface px-6 py-12 text-center">
      <AlertTriangle className="h-10 w-10 text-accent" />
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {message && <p className="max-w-md text-sm text-muted">{message}</p>}
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-text hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        )}
        {retryHref && (
          <Link
            href={retryHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-text hover:opacity-90"
          >
            Go Home
          </Link>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  message,
  icon,
}: {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/10 px-6 py-16 text-center">
      {icon ?? <Inbox className="h-10 w-10 text-muted" />}
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {message && <p className="max-w-md text-sm text-muted">{message}</p>}
    </div>
  );
}
