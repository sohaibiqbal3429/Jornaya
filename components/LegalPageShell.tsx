import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  effectiveDate: string;
  documentLabel: string;
  sections: LegalSection[];
};

const companyDetails = [
  'Apha Health Plan',
  '+1 (202) 984-8556',
  'hello@aphahealthplan.com',
  '1500 N Grant St STE R, Denver, CO 80203',
];

export function LegalPageShell({
  eyebrow,
  title,
  intro,
  effectiveDate,
  documentLabel,
  sections,
}: LegalPageShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6fafb] text-[#082033]">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#90f0e3]/35 blur-3xl" />
        <div className="absolute right-[-10rem] top-40 h-[30rem] w-[30rem] rounded-full bg-[#b8d7ff]/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#d9f99d]/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Apha Health Plan home" className="rounded-2xl transition hover:opacity-90">
            <BrandMark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#d7e8ec] bg-white px-4 py-2.5 text-sm font-bold text-[#082033] shadow-sm transition hover:-translate-y-0.5 hover:border-[#9fd9d5]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <section className="relative z-10 px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bfe8e6] bg-white/75 px-4 py-2 text-sm font-bold text-[#0b6f75] shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-[#13a8a3]" />
              {eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-[-0.065em] text-[#082033] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5e7280]">{intro}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.7rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6a828d]">Company</p>
                <p className="mt-2 text-sm font-bold text-[#082033]">Apha Health Plan</p>
              </div>
              <div className="rounded-[1.7rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6a828d]">Document</p>
                <p className="mt-2 text-sm font-bold text-[#082033]">{documentLabel}</p>
              </div>
              <div className="rounded-[1.7rem] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6a828d]">Effective Date</p>
                <p className="mt-2 text-sm font-bold text-[#082033]">{effectiveDate}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_24px_70px_rgba(8,32,51,0.08)] backdrop-blur-xl">
              <div className="border-b border-[#e7f1f3] bg-gradient-to-r from-white via-[#f4fffd] to-[#eff6ff] px-5 py-4">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#526b78]">On this page</p>
              </div>
              <nav className="p-3">
                <ul className="space-y-1.5">
                  {sections.map((section, index) => {
                    const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <li key={section.title}>
                        <a
                          href={`#${sectionId}`}
                          className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-[#526b78] transition hover:bg-[#f0f8f9] hover:text-[#082033]"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#effaf9] text-xs font-black text-[#0a5962]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="font-semibold leading-5">{section.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          <div className="space-y-6 sm:space-y-8">
            {sections.map((section, index) => {
              const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <section
                  id={sectionId}
                  key={section.title}
                  className="overflow-hidden rounded-[2rem] border border-white/85 bg-white/85 shadow-[0_24px_70px_rgba(8,32,51,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_34px_90px_rgba(8,32,51,0.11)]"
                >
                  <div className="border-b border-[#e7f1f3] bg-gradient-to-r from-white via-[#f4fffd] to-[#eff6ff] px-6 py-5 sm:px-8">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.15rem] bg-gradient-to-br from-[#0d9488] to-[#2563eb] text-sm font-black text-white shadow-[0_18px_40px_rgba(13,148,136,0.28)]">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-[-0.045em] text-[#082033] sm:text-[1.9rem]">
                          {section.title}
                        </h2>
                        <div className="mt-2 h-1.5 w-18 rounded-full bg-gradient-to-r from-[#0d9488] to-[#60a5fa]" />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6 sm:px-8 sm:py-8">
                    {section.paragraphs ? (
                      <div className="space-y-5 text-[15px] leading-8 text-[#4f6875] sm:text-base">
                        {section.paragraphs.map((paragraph, paragraphIndex) => (
                          <p key={`${section.title}-paragraph-${paragraphIndex}`}>{paragraph}</p>
                        ))}
                      </div>
                    ) : null}

                    {section.bullets ? (
                      <ul className={`grid gap-3 text-[15px] leading-8 text-[#4f6875] sm:text-base ${section.paragraphs ? 'mt-6' : ''}`}>
                        {section.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={`${section.title}-bullet-${bulletIndex}`}
                            className="flex items-start gap-4 rounded-[1.4rem] border border-[#e7f1f3] bg-[#f7fcfc] px-4 py-4"
                          >
                            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dff8f4] text-sm font-black text-[#0a5962]">
                              ✓
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              );
            })}

            <section className="rounded-[2rem] border border-[#dcebed] bg-[#082033] p-8 text-white shadow-[0_34px_90px_rgba(6,42,60,0.2)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#9ee7e3]">Questions</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Need a compliance or privacy contact?</h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#c6d9df]">
                    Contact Apha Health Plan for privacy requests, accessibility needs, or questions about our Medicare consultation experience.
                  </p>
                </div>
                <div className="grid gap-2 text-sm font-semibold text-[#edfafa]">
                  {companyDetails.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/14"
                >
                  Privacy Policy
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/terms-of-service"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/14"
                >
                  Terms & Conditions
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/disclaimer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/14"
                >
                  Disclaimer
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
