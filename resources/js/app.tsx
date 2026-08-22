import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOM from 'react-dom/client';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Restoran';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = ReactDOM.createRoot(el);
        root.render(<App {...props} />);

        // Make route() available globally for Ziggy
        if (typeof window.Ziggy === 'object' && typeof window.location !== 'undefined') {
            const configuredRoute = route.bind({ ...route, t: window.Ziggy });
            window.route = configuredRoute;
        }
    },
});

// Global route function for TypeScript
if (typeof window !== 'undefined') {
    window.route = window.route || route;
}
