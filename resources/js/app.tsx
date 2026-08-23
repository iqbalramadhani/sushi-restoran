import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import type { Page } from '@inertiajs/core';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOM from 'react-dom/client';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Restoran';

function getInitialPageFromDiv(): Page | undefined {
    if (typeof document === 'undefined') return undefined;
    const el = document.getElementById('app');
    if (el?.hasAttribute('data-page')) {
        try {
            return JSON.parse(decodeURIComponent(el.getAttribute('data-page')!)) as Page;
        } catch {
            return undefined;
        }
    }
    return undefined;
}

if (typeof window !== 'undefined') {
    createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        page: getInitialPageFromDiv(),
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup({ el, App, props }) {
            const root = ReactDOM.createRoot(el);
            root.render(<App {...props} />);

            if (typeof window.Ziggy === 'object' && typeof window.location !== 'undefined') {
                const configuredRoute = route.bind({ ...route, t: window.Ziggy });
                window.route = configuredRoute;
            }
        },
    });
}

if (typeof window !== 'undefined') {
    window.route = window.route || route;
}
