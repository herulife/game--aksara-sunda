import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  headerTitle: string;
  title: string;
  description: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  children: ReactNode;
};

export function AuthShell({
  headerTitle,
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthShellProps) {
  return (
    <main className="mockup-screen">
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[820px] items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-[560px]">
          <div className="mb-4 text-center text-[0.95rem] font-black uppercase tracking-[0.04em] text-[#fff5dd] drop-shadow-[0_4px_12px_rgba(46,38,18,0.22)] sm:text-[1.2rem]">
            {headerTitle}
          </div>

          <div className="mockup-card rounded-[1.35rem] px-5 py-6 text-center shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:px-7 sm:py-8">
            <h1 className="text-[1.7rem] font-black leading-[1.05] text-[#2c2517] sm:text-[2.25rem]">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-[410px] text-sm font-bold leading-[1.4] text-[#665337] sm:text-base">
              {description}
            </p>

            <div className="mt-5 sm:mt-6">{children}</div>

            <p className="mt-5 text-xs font-bold text-[#5c4a2f] sm:text-sm">
              {footerText}{" "}
              <Link href={footerLinkHref} className="text-[#2f7f33] underline underline-offset-4">
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
