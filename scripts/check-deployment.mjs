import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const outputDirectory = resolve("dist");
const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap-index.xml",
];
const excludedSitemapUrls = [
  "https://sanelio.de/datenschutz/",
  "https://sanelio.de/impressum/",
  "https://sanelio.de/kontakt/",
  "https://sanelio.de/prime/entstehung/",
  "https://sanelio.de/prime/prinzipien-und-arbeitsweise/",
  "https://sanelio.de/prime/weiterentwicklung/",
];
const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(resolve(outputDirectory, file))) {
    failures.push(`Erwartete Build-Datei fehlt: ${file}`);
  }
}

if (failures.length === 0) {
  const indexHtml = readFileSync(
    resolve(outputDirectory, "index.html"),
    "utf8",
  );
  const robots = readFileSync(resolve(outputDirectory, "robots.txt"), "utf8");
  const sitemapIndex = readFileSync(
    resolve(outputDirectory, "sitemap-index.xml"),
    "utf8",
  );

  if (
    !indexHtml.includes('<link rel="canonical" href="https://sanelio.de/">')
  ) {
    failures.push("Die Startseite besitzt nicht die erwartete Canonical URL.");
  }

  if (indexHtml.includes("github.io")) {
    failures.push("Die Produktionsausgabe enthält unerwartet github.io.");
  }

  if (!robots.includes("Sitemap: https://sanelio.de/sitemap-index.xml")) {
    failures.push("robots.txt verweist nicht auf die produktive Sitemap.");
  }

  const sitemapLocations = [
    ...sitemapIndex.matchAll(/<loc>https:\/\/sanelio\.de\/([^<]+)<\/loc>/g),
  ].map((match) => match[1]);

  if (sitemapLocations.length === 0) {
    failures.push("Der Sitemap-Index enthält keine Sanelio-Sitemap.");
  }

  for (const sitemap of sitemapLocations) {
    const sitemapFile = resolve(outputDirectory, sitemap);

    if (!existsSync(sitemapFile)) {
      failures.push(`Im Sitemap-Index referenzierte Datei fehlt: ${sitemap}`);
      continue;
    }

    const sitemapContent = readFileSync(sitemapFile, "utf8");
    for (const excludedUrl of excludedSitemapUrls) {
      if (sitemapContent.includes(excludedUrl)) {
        failures.push(
          `Nicht veröffentlichungsreife Seite steht in der Sitemap: ${excludedUrl}`,
        );
      }
    }
  }
}

const deploymentWorkflow = readFileSync(
  resolve(".github/workflows/deploy-pages.yml"),
  "utf8",
);
const activationGate = "if: vars.SANELIO_PAGES_ENABLED == 'true'";
const activationGateCount = deploymentWorkflow.split(activationGate).length - 1;

if (activationGateCount !== 2) {
  failures.push(
    `Der Pages-Workflow muss genau zwei Aktivierungssperren besitzen, gefunden: ${activationGateCount}.`,
  );
}

if (!deploymentWorkflow.includes("workflow_dispatch:")) {
  failures.push("Der Pages-Workflow besitzt keinen manuellen Startpunkt.");
}

if (/^\s+push:\s*$/m.test(deploymentWorkflow)) {
  failures.push(
    "Der Pages-Workflow darf vor der Go-live-Freigabe nicht automatisch bei Push auslösen.",
  );
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  "Deployment-Prüfung bestanden: statischer Build, 404, robots.txt, Canonical URL und Sitemap sind konsistent.",
);
