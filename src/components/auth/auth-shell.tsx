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
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[980px] flex-col px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-4 inline-flex w-fit self-start rounded-md bg-[rgba(20,58,36,0.82)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4df9d] sm:text-sm">
          {headerTitle}
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[540px]">
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
        </div>
      </section>
    </main>
  );
}
