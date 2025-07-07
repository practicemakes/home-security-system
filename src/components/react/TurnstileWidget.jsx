import { useEffect, useRef } from 'react';

export default function TurnstileWidget({ onVerify, onError, onExpire }) {
    const turnstileRef = useRef(null);
    const widgetId = useRef(null);

    useEffect(() => {
        // Load Turnstile script
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.turnstile && turnstileRef.current) {
                widgetId.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
                    callback: function(token) {
                        onVerify(token);
                    },
                    'error-callback': function() {
                        onError();
                    },
                    'expired-callback': function() {
                        onExpire();
                    },
                    theme: 'light',
                    size: 'normal'
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup
            if (window.turnstile && widgetId.current) {
                window.turnstile.remove(widgetId.current);
            }
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [onVerify, onError, onExpire]);

    return (
        <div className="turnstile-widget">
            <div ref={turnstileRef}></div>
        </div>
    );
}