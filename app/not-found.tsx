import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <Image
        src="https://res.cloudinary.com/paihc5qx/image/upload/v1788693909/Pineapple_tv_application_icon_ari8mj.png"
        alt=""
        width={48}
        height={48}
        className="rounded-xl"
        aria-hidden="true"
      />
      <h1 className="text-2xl font-bold text-text">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or the content could not be found.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-text hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}
