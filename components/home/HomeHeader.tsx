'use client';

import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';

type NavItem = {
  label: string;
  href: string;
};

type HomeHeaderProps = {
  navItems: NavItem[];
};

export function HomeHeader({ navItems }: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav className="mx-auto max-w-7xl rounded-[1.7rem] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_24px_70px_rgba(8,32,51,0.10)] backdrop-blur-2xl sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" aria-label="Alpha Legal Intake home">
            <BrandMark />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-[#526b78] transition hover:text-[#082033]">
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="tel:+12029848556" className="text-sm font-bold text-[#0a5962]">
              (202) 984-8556
            </a>
            <a
              href="#consultation"
              className="group inline-flex items-center gap-2 rounded-full bg-[#062a3c] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_34px_rgba(6,42,60,0.20)] transition hover:-translate-y-0.5 hover:bg-[#0b3b53]"
            >
              Start intake <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-[#d7e8ec] bg-white text-[#082033] shadow-sm lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="mt-4 rounded-[1.35rem] border border-[#dcebed] bg-white p-3 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#526b78] hover:bg-[#f0f8f9]"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#consultation"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl bg-[#062a3c] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Request legal intake
              </a>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
