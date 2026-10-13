import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { readConsent } from '@/consent';
import useCookieConsent from '@/utils/useCookieConsent';

type CredentialResponse = {
  credential: string;
};

type GoogleSignInButtonProps = {
  onCredential: (credential: string) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number>,
          ) => void;
        };
      };
    };
  }
}

const SCRIPT_ID = 'google-identity-services';
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const hasAcceptedCookies = useCookieConsent();

  callbackRef.current = onCredential;

  useEffect(() => {
    if (!clientId || !hasAcceptedCookies || readConsent()?.accepted !== true) return;
    let active = true;

    const render = () => {
      if (!active || readConsent()?.accepted !== true || !window.google || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (active && readConsent()?.accepted === true) callbackRef.current(response.credential);
        },
      });
      containerRef.current.replaceChildren();
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 304,
        locale: i18n.resolvedLanguage ?? 'en',
      });
    };

    const existingScript = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (window.google) {
      render();
      return () => { active = false; };
    }

    const script = existingScript ?? document.createElement('script');
    script.addEventListener('load', render);

    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      script.removeEventListener('load', render);
      if (!existingScript) script.remove();
    };
  }, [clientId, hasAcceptedCookies, i18n.resolvedLanguage]);

  if (!clientId || !hasAcceptedCookies) return null;

  return <div ref={containerRef} aria-label={t('Continue with Google')} />;
}

export default GoogleSignInButton;
