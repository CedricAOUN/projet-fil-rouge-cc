import { useEffect, useState } from 'react';
import { CONSENT_CHANGED_EVENT, CONSENT_KEY, consentExpiresAt, readConsent } from '@/consent';

export default function useCookieConsent() {
  const [accepted, setAccepted] = useState(() => readConsent()?.accepted === true);

  useEffect(() => {
    let timeout: number;
    const sync = () => {
      window.clearTimeout(timeout);
      const consent = readConsent();
      setAccepted(consent?.accepted === true);
      if (consent?.accepted) {
        timeout = window.setTimeout(sync, Math.min(consentExpiresAt(consent) - Date.now(), 2_147_483_647));
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) sync();
    };

    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', sync);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', sync);
    };
  }, []);

  return accepted;
}
