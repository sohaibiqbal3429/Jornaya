'use client';

type BrandMarkProps = {
  tone?: 'dark' | 'light';
  size?: 'default' | 'compact';
};

export function BrandMark({ tone = 'dark', size = 'default' }: BrandMarkProps) {
  const darkTone = tone === 'dark';
  const compact = size === 'compact';

  return (
    <div className={`flex items-center ${compact ? 'gap-2.5' : 'gap-3'}`}>
      <div
        className={`relative grid place-items-center overflow-hidden rounded-2xl bg-[#062a3c] ${
          compact ? 'h-10 w-10' : 'h-11 w-11'
        } shadow-[0_18px_38px_rgba(6,42,60,0.18)]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(94,234,212,0.92),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.2),transparent)]" />
        <span className="relative text-lg font-black tracking-[-0.08em] text-white">AH</span>
      </div>
      <div className="leading-none">
        <p
          className={`font-black tracking-[-0.04em] ${
            compact ? 'text-[0.98rem]' : 'text-base'
          } ${darkTone ? 'text-[#082033]' : 'text-white'}`}
        >
          Apha
        </p>
        <p
          className={`font-semibold uppercase tracking-[0.24em] ${
            compact ? 'text-[0.62rem]' : 'text-[0.68rem]'
          } ${darkTone ? 'text-[#4f7c83]' : 'text-[#9ee7e3]'}`}
        >
          Health Plan
        </p>
      </div>
    </div>
  );
}
