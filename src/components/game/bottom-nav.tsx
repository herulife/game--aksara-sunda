import Image from "next/image";
import Link from "next/link";

type BottomNavItem = {
  label: string;
  href: string;
  icon: string;
  width: number;
  height: number;
};

const items: BottomNavItem[] = [
  { label: "Beranda", href: "/dashboard", icon: "/assets/icons/book-open.png", width: 544, height: 544 },
  { label: "Belajar", href: "/level", icon: "/assets/icons/star-gold.png", width: 259, height: 246 },
  { label: "Progres", href: "/progres", icon: "/assets/icons/progress-bars.png", width: 448, height: 375 },
  { label: "Pengaturan", href: "/pengaturan", icon: "/assets/icons/speaker-white.png", width: 469, height: 396 },
];

type BottomNavProps = {
  active?: string;
  className?: string;
};

export function BottomNav({ active, className = "" }: BottomNavProps) {
  return (
    <div
      className={`grid w-full max-w-[460px] grid-cols-4 gap-1.5 rounded-[0.9rem] bg-[#7ba861]/95 px-2 py-2 text-white shadow-[0_12px_20px_rgba(35,28,15,0.16)] ${className}`}
    >
      {items.map((item) => {
        const isActive = active === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 text-center"
          >
            <span
              className={`flex h-7.5 w-7.5 items-center justify-center rounded-full ${
                isActive ? "bg-white/30 ring-2 ring-white/65" : "bg-white/18"
              }`}
            >
              <Image
                src={item.icon}
                alt=""
                width={item.width}
                height={item.height}
                className="h-4 w-4"
              />
            </span>
            <span className="text-[0.56rem] font-black leading-tight sm:text-[0.66rem]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
