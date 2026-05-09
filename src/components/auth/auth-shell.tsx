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
      <header className="mockup-header px-4 py-3 text-[1.05rem] leading-tight sm:py-4 sm:text-[1.85rem]">
        {headerTitle}
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-66px)] w-full max-w-[760px] flex-col items-center px-3 pb-6 pt-4 text-center sm:px-5 sm:pb-8 sm:pt-5">
        <h1 className="mockup-title max-w-[680px] text-[2rem] leading-[1.02] sm:text-[3.1rem] lg:text-[3.8rem]">
          {title}
        </h1>
        <p className="mockup-white-title mt-2.5 max-w-[620px] text-sm leading-[1.3] sm:mt-4 sm:text-lg">
          {description}
        </p>

        <div className="mt-5 w-full max-w-[620px] sm:mt-6">{children}</div>

        <p className="mockup-white-title mt-4 text-xs font-bold sm:mt-6 sm:text-base">
          {footerText}{" "}
          <Link href={footerLinkHref} className="underline underline-offset-4">
            {footerLinkLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}
