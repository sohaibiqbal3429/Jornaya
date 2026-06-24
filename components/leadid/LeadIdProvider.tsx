'use client';

import Script from 'next/script';
import {
  createContext,
  use,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  LEADID_CAMPAIGN_KEY,
  LEADID_SCRIPT_SRC,
  isValidLeadIdToken,
  type LeadIdDebugPayload,
} from '@/lib/leadid';

declare global {
  interface Window {
    LeadiD?: {
      reInit?: () => void;
    };
    __playwright__binding__?: unknown;
    __pwInitScripts?: unknown;
  }
}

type LeadIdContextValue = {
  debug: LeadIdDebugPayload;
  token: string;
  tokenValid: boolean;
  reInit: (reason?: string) => void;
  waitForValidToken: (timeoutMs?: number) => Promise<string | null>;
};

const LeadIdContext = createContext<LeadIdContextValue | null>(null);

function getCurrentRoute() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getUtmParams(url: string) {
  try {
    const params = new URL(url).searchParams;
    return Object.fromEntries(
      [...params.entries()].filter(([key]) => key.toLowerCase().startsWith('utm_')),
    );
  } catch {
    return {};
  }
}

function getPlaybackSignals() {
  if (typeof window === 'undefined') {
    return {};
  }

  const navigationEntry = window.performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;

  return {
    webdriver: navigator.webdriver,
    userAgent: navigator.userAgent,
    visibilityState: document.visibilityState,
    navigationType: navigationEntry?.type ?? null,
    playwrightBinding: Boolean(window.__playwright__binding__),
    playwrightInitScripts: Boolean(window.__pwInitScripts),
  };
}

const initialDebugState: LeadIdDebugPayload = {
  campaignKey: LEADID_CAMPAIGN_KEY,
  scriptSrc: LEADID_SCRIPT_SRC,
  scriptLoaded: false,
  token: '',
  tokenValid: false,
  jornayaAvailable: false,
  referrer: '',
  landingUrl: '',
  utmParams: {},
  routeHistory: [],
  interactionCount: 0,
  canonicalFieldPresent: false,
  mirroredFieldPresent: false,
  lastMirrorSyncAt: null,
  lastReinitAt: null,
  lastReinitReason: null,
  playbackSignals: {},
};

export function LeadIdProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [debug, setDebug] = useState<LeadIdDebugPayload>(initialDebugState);
  const routeHistoryRef = useRef<string[]>([]);
  const interactionCountRef = useRef(0);
  const tokenRef = useRef('');
  const routeChangedAtRef = useRef(Date.now());
  const lastReinitAtRef = useRef(0);
  const lastReinitReasonRef = useRef<string | null>(null);
  const landingUrlRef = useRef('');

  const reInit = useEffectEvent((reason = 'manual') => {
    lastReinitAtRef.current = Date.now();
    lastReinitReasonRef.current = reason;

    if (typeof window !== 'undefined' && typeof window.LeadiD?.reInit === 'function') {
      try {
        window.LeadiD.reInit();
      } catch (error) {
        console.error('LeadiD reInit failed.', error);
      }
    }

    setDebug((prev) => ({
      ...prev,
      lastReinitAt: new Date(lastReinitAtRef.current).toISOString(),
      lastReinitReason: lastReinitReasonRef.current,
    }));
  });

  const syncLeadIdState = useEffectEvent(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const canonicalField = document.querySelector<HTMLInputElement>(
      'input#leadid_token[name="universal_leadid"]',
    );
    const mirroredField = document.querySelector<HTMLInputElement>(
      'input#leadid_token_form[name="universal_leadid"]',
    );
    const nextToken = canonicalField?.value.trim() ?? '';
    const tokenValid = isValidLeadIdToken(nextToken);

    tokenRef.current = nextToken;

    if (mirroredField) {
      mirroredField.value = nextToken;
    }

    const now = Date.now();
    const routeAgeMs = now - routeChangedAtRef.current;
    if (!tokenValid && routeAgeMs >= 8_000 && now - lastReinitAtRef.current >= 8_000) {
      reInit('token-missing-after-timeout');
    }

    setDebug((prev) => ({
      ...prev,
      scriptLoaded: prev.scriptLoaded || Boolean(window.LeadiD) || Boolean(canonicalField),
      token: nextToken,
      tokenValid,
      jornayaAvailable: Boolean(window.LeadiD),
      referrer: document.referrer,
      landingUrl: landingUrlRef.current || window.location.href,
      utmParams: getUtmParams(landingUrlRef.current || window.location.href),
      routeHistory: routeHistoryRef.current,
      interactionCount: interactionCountRef.current,
      canonicalFieldPresent: Boolean(canonicalField),
      mirroredFieldPresent: Boolean(mirroredField),
      lastMirrorSyncAt: mirroredField ? new Date().toISOString() : prev.lastMirrorSyncAt,
      lastReinitAt: lastReinitAtRef.current ? new Date(lastReinitAtRef.current).toISOString() : prev.lastReinitAt,
      lastReinitReason: lastReinitReasonRef.current,
      playbackSignals: getPlaybackSignals(),
    }));
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!landingUrlRef.current) {
      landingUrlRef.current = window.location.href;
    }

    const nextRoute = getCurrentRoute();
    if (routeHistoryRef.current.at(-1) !== nextRoute) {
      routeHistoryRef.current = [...routeHistoryRef.current.slice(-14), nextRoute];
    }

    routeChangedAtRef.current = Date.now();
    syncLeadIdState();
    reInit('route-change');
  }, [pathname, reInit, syncLeadIdState]);

  useEffect(() => {
    syncLeadIdState();

    const intervalId = window.setInterval(() => {
      syncLeadIdState();
    }, 500);

    const countInteraction = () => {
      interactionCountRef.current += 1;
    };

    window.addEventListener('pointerdown', countInteraction, { passive: true });
    window.addEventListener('keydown', countInteraction);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('pointerdown', countInteraction);
      window.removeEventListener('keydown', countInteraction);
    };
  }, [syncLeadIdState]);

  const waitForValidToken = useEffectEvent(async (timeoutMs = 6_000) => {
    syncLeadIdState();

    if (isValidLeadIdToken(tokenRef.current)) {
      return tokenRef.current;
    }

    reInit('submit-wait');

    const startedAt = Date.now();

    return await new Promise<string | null>((resolve) => {
      const intervalId = window.setInterval(() => {
        syncLeadIdState();

        if (isValidLeadIdToken(tokenRef.current)) {
          window.clearInterval(intervalId);
          resolve(tokenRef.current);
          return;
        }

        if (Date.now() - startedAt >= timeoutMs) {
          window.clearInterval(intervalId);
          resolve(null);
        }
      }, 250);
    });
  });

  return (
    <LeadIdContext
      value={{
        debug,
        token: debug.token,
        tokenValid: debug.tokenValid,
        reInit,
        waitForValidToken,
      }}
    >
      <Script id="LeadiDscript_campaign" src={LEADID_SCRIPT_SRC} strategy="beforeInteractive" />
      <input id="leadid_token" name="universal_leadid" type="hidden" />
      {children}
    </LeadIdContext>
  );
}

export function useLeadId() {
  const context = use(LeadIdContext);

  if (!context) {
    throw new Error('useLeadId must be used inside LeadIdProvider.');
  }

  return context;
}
