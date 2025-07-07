import { useEffect, useRef } from 'react';

export default function TurnstileWidget({ onVerify, onError }) {
    const turnstileRef = useRef(null);
    const widgetId = useRef(null);

    useEffect(() => {
        if (window.turnstile && turnstileRef.current && !widgetId.current) {
            widgetId.current = window.turnstile.render(turnstileRef.current, {
                sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
                callback: onVerify,
                'error-callback': onError,
                'expired-callback': onError
            });
        }

        // Cleanup on unmount
        return () => {
            if (window.turnstile && widgetId.current) {
                window.turnstile.remove(widgetId.current);
                widgetId.current = null;
            }
        };
    }, []); // Empty dependency array - only run once

    return <div ref={turnstileRef}></div>;
}