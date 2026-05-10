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
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthShellProps) {
  return (
    <main className="mockup-screen">
      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[980px] flex-col justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[500px]">
            <div className="mockup-card mx-auto w-full rounded-[1.45rem] px-5 py-7 text-center shadow-[0_18px_30px_rgba(35,28,15,0.2)] sm:px-7 sm:py-8">
              <h1 className="mockup-title text-[1.78rem] leading-[1.02] text-[#2c2517] sm:text-[2.3rem]">
                {title}
              </h1>
              <p className="mockup-copy mx-auto mt-2 max-w-[360px] text-[0.9rem] text-[#665337] sm:text-[0.95rem]">
                {description}
              </p>

              <div className="mt-5 sm:mt-6">{children}</div>

              <p className="mockup-copy mt-4 text-[0.76rem] text-[#5c4a2f] sm:text-[0.82rem]">
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
