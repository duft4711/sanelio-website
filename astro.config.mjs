import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://sanelio.de",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) =>
        ![
          "https://sanelio.de/datenschutz/",
          "https://sanelio.de/impressum/",
          "https://sanelio.de/kontakt/",
          "https://sanelio.de/prime/entstehung/",
          "https://sanelio.de/prime/prinzipien-und-arbeitsweise/",
          "https://sanelio.de/prime/weiterentwicklung/",
        ].includes(page),
    }),
  ],
});
