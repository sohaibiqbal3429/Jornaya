export const LEADID_CAMPAIGN_KEY = 'f3982147-9948-8ae0-9315-8ceb32269185';
export const LEADID_SCRIPT_SRC = `https://create.lidstatic.com/campaign/${LEADID_CAMPAIGN_KEY}.js?snippet_version=2`;

export const LEADID_TOKEN_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const LEADID_TOKEN_FIELD_NAMES = ['leadiD_token', 'leadid_token', 'universal_leadid'] as const;

export type LeadIdDebugPayload = {
  campaignKey: string;
  scriptSrc: string;
  scriptLoaded: boolean;
  token: string;
  tokenValid: boolean;
  jornayaAvailable: boolean;
  referrer: string;
  landingUrl: string;
  utmParams: Record<string, string>;
  routeHistory: string[];
  interactionCount: number;
  canonicalFieldPresent: boolean;
  mirroredFieldPresent: boolean;
  lastMirrorSyncAt: string | null;
  lastReinitAt: string | null;
  lastReinitReason: string | null;
  playbackSignals: Record<string, unknown>;
};

export function normalizeLeadIdToken(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !LEADID_TOKEN_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed.toUpperCase();
}

export function isValidLeadIdToken(value: unknown) {
  return normalizeLeadIdToken(value) !== null;
}

export function resolveLeadIdToken(source: Record<string, unknown>) {
  for (const key of LEADID_TOKEN_FIELD_NAMES) {
    const normalized = normalizeLeadIdToken(source[key]);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}
