export const CONSENT_KEY = 'analytics-consent';
export type Consent = { version: number; accepted: boolean; timestamp: number };

export function consentExpiresAt(consent: Consent): number {
  const expiry = new Date(consent.timestamp);
  expiry.setMonth(expiry.getMonth() + 6);
  return expiry.getTime();
}

export function readConsent(): Consent | null {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null');
    if (!value || value.version !== 1 || typeof value.accepted !== 'boolean'
      || typeof value.timestamp !== 'number' || !Number.isFinite(value.timestamp)
      || value.timestamp > Date.now() || !Number.isFinite(consentExpiresAt(value))
      || consentExpiresAt(value) <= Date.now()) return null;
    return value;
  } catch { return null; }
}

export function saveConsent(accepted: boolean): Consent {
  const consent = { version: 1, accepted, timestamp: Date.now() };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); }
  catch { /* Keep the choice in memory for this visit when storage is unavailable. */ }
  return consent;
}
