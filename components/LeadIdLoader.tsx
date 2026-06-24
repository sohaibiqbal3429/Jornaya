'use client';

import Script from 'next/script';

const leadIdScriptSrc = process.env.NEXT_PUBLIC_LEADID_SCRIPT_SRC?.trim();
const leadIdNoscriptUrl = process.env.NEXT_PUBLIC_LEADID_NOSCRIPT_URL?.trim();

export function LeadIdLoader() {
  if (!leadIdScriptSrc) {
    return null;
  }

  return (
    <>
      <Script id="LeadiDscript_campaign" src={leadIdScriptSrc} strategy="afterInteractive" />
      {leadIdNoscriptUrl ? (
        <noscript>
          <img src={leadIdNoscriptUrl} alt="" />
        </noscript>
      ) : null}
    </>
  );
}
