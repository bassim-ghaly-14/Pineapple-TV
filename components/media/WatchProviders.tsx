import Image from "next/image";
import { Tv, ShoppingBag, Ticket } from "lucide-react";

interface Provider {
  id: number;
  name: string;
  logoPath: string | null;
}

interface Props {
  readonly providers: {
    readonly streaming: Provider[];
    readonly rent: Provider[];
    readonly buy: Provider[];
  };
}

function ProviderGroup({
  title,
  icon,
  providers,
}: {
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly providers: Provider[];
}) {
  if (providers.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-1.5 text-sm font-medium text-muted">
        {icon} {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-2.5 py-1.5"
          >
            {p.logoPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/original${p.logoPath}`}
                alt=""
                width={24}
                height={24}
                className="rounded"
                aria-hidden="true"
              />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded bg-surface-elevated text-xs text-muted">
                {p.name.charAt(0)}
              </span>
            )}
            <span className="text-xs text-text">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WatchProviders({ providers }: Props) {
  const hasAny = providers.streaming.length > 0 || providers.rent.length > 0 || providers.buy.length > 0;
  if (!hasAny) return null;

  return (
    <section aria-labelledby="providers-heading" className="space-y-3">
      <h2 id="providers-heading" className="text-lg font-bold text-text">Where to Watch</h2>
      <p className="text-xs text-muted">Informational only · Availability varies by region</p>
      <div className="space-y-4">
        <ProviderGroup title="Streaming" icon={<Tv className="h-4 w-4" />} providers={providers.streaming} />
        <ProviderGroup title="Rent" icon={<Ticket className="h-4 w-4" />} providers={providers.rent} />
        <ProviderGroup title="Buy" icon={<ShoppingBag className="h-4 w-4" />} providers={providers.buy} />
      </div>
    </section>
  );
}
