import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";

const localProxy = "http://127.0.0.1:8080/"

console.log(import.meta.env.PRODUCTION)

const proxy = import.meta.env.PRODUCTION ? ({}) : ({
  "/api": localProxy
});

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react(),
  ],
  vite: {
    server: {
      proxy
    }
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});