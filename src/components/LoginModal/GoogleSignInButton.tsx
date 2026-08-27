import { useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  callbackRef.current = onCredential;

  useEffect(() => {
    if (!clientId) return;

    const render = () => {
      if (!window.google || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => callbackRef.current(response.credential),
      });
      containerRef.current.replaceChildren();
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 304,
      });
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (window.google) {
      render();
      return;
    }

    const script = existingScript ?? document.createElement('script');
    script.addEventListener('load', render);

    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    return () => script.removeEventListener('load', render);
  }, [clientId]);

  if (!clientId) return null;

  return <div ref={containerRef} aria-label='Continue with Google' />;
}

export default GoogleSignInButton;
