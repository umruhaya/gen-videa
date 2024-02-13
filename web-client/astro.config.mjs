import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react()
  ],
  vite: {
    server: {
      proxy: {
        "/api": import.meta.env.MODE === "development" ? "http://127.0.0.1:8080/proxy" :"https://web.genvidea.com",
      }
    }
  }
});