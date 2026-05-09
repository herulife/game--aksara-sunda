import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="leaf-frame card-panel w-full max-w-5xl rounded-[2rem] p-5 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-strong">
              {eyebrow}
            </div>
            <h1 className="mt-4 text-4xl font-black text-primary-strong">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f4d31]">
              {description}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="btn-secondary rounded-2xl px-4 py-3 text-center font-bold"
          >
            Kembali ke Menu
          </Link>
        </div>

        {children}
      </section>
    </main>
  );
}
