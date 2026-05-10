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
        <div className="w-full max-w-[540px]">
          <div className="mb-4 text-center text-[1rem] font-black uppercase tracking-[0.04em] text-[#fff5dd] drop-shadow-[0_4px_12px_rgba(46,38,18,0.22)] sm:text-[1.25rem]">
            {headerTitle}
          </div>

          <div className="mockup-card rounded-[1.45rem] px-5 py-7 text-center shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:px-8 sm:py-9">
            <h1 className="text-[1.9rem] font-black leading-[1.02] text-[#2c2517] sm:text-[2.45rem]">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-[410px] text-sm font-bold leading-[1.4] text-[#665337] sm:text-base">
              {description}
            </p>

            <div className="mt-6 sm:mt-7">{children}</div>

            <p className="mt-6 text-xs font-bold text-[#5c4a2f] sm:text-sm">
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
