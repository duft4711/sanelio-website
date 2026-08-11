import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://duft4711.github.io",
  base: "/sanelio-website",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) =>
        ![
          "https://duft4711.github.io/sanelio-website/datenschutz/",
          "https://duft4711.github.io/sanelio-website/impressum/",
          "https://duft4711.github.io/sanelio-website/kontakt/",
          "https://duft4711.github.io/sanelio-website/prime/entstehung/",
          "https://duft4711.github.io/sanelio-website/prime/prinzipien-und-arbeitsweise/",
          "https://duft4711.github.io/sanelio-website/prime/weiterentwicklung/",
        ].includes(page),
    }),
  ],
});
