import React, { useEffect, useRef, useState } from 'react';
import authConfig from '../config/auth';

let gisScriptPromise = null;
const loadGoogleScript = () => {
  if (gisScriptPromise) return gisScriptPromise;
  gisScriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return gisScriptPromise;
};

/**
 * Renders a "Sign in with Google" button. Silently renders nothing if
 * VITE_GOOGLE_CLIENT_ID isn't configured — see src/config/auth.js.
 *
 * @param {(credential: string) => void} onCredential - called with the raw
 *   Google ID token on success; the parent is responsible for POSTing it to
 *   /api/auth/google.
 */
const GoogleSignInButton = ({ onCredential, text = 'continue_with' }) => {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authConfig.GOOGLE_CLIENT_ID) return;

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: authConfig.GOOGLE_CLIENT_ID,
          callback: (response) => onCredential(response.credential),
        });
        setReady(true);
      })
      .catch(() => {
        // Network issue loading Google's script — button just won't appear.
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready && buttonRef.current && window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text,
      });
    }
  }, [ready, text]);

  if (!authConfig.GOOGLE_CLIENT_ID) return null;

  return <div ref={buttonRef} className="d-flex justify-content-center my-2" />;
};

export default GoogleSignInButton;
