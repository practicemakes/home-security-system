import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    output: "static",
    base: "/home-security-system/",
    integrations: [react(), tailwind()],
});
