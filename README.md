# Sanelio Website

Öffentliche Website der Technologiemarke Sanelio. Die erste Version erklärt
Technologie verständlich, dokumentiert Prime als eigenständiges Projekt innerhalb
von Sanelio und schafft eine wartbare Grundlage für spätere Fallstudien.

Die Website ist vollständig statisch. Sie verwendet weder serverseitige Laufzeit
noch Datenbank, Tracking, externe Schriftarten oder externe APIs.

## Technische Grundlage

- [Astro](https://astro.build/) als statischer Website-Generator
- TypeScript für Konfiguration und Inhaltsmodelle
- Markdown für redaktionelle Inhalte und Fallstudien
- lokales CSS mit Systemschriften
- npm mit festgeschriebener Lockdatei

Voraussetzung ist Node.js 22.12 oder neuer. Entwickelt und geprüft wird mit der in
der Lockdatei dokumentierten npm-Version.

## Installation

```bash
npm ci --include=dev
```

Der Zusatz `--include=dev` stellt sicher, dass die festgeschriebenen
Prüfwerkzeuge auch in Umgebungen mit `NODE_ENV=production` installiert werden.

## Lokale Entwicklung

```bash
npm run dev
```

Astro startet anschließend standardmäßig unter `http://localhost:4321`.

## Produktions-Build und Vorschau

```bash
npm run build
npm run preview
```

Der statische Build wird nach `dist/` geschrieben. `preview` dient ausschließlich
der lokalen Prüfung dieses Builds.

## Qualitätsprüfungen

```bash
npm run format:check
npm run check
npm run build
npm run check:links
npm run check:deployment
npm run quality
```

- `format:check` prüft die Formatierung.
- `check` führt die Astro- und TypeScript-Prüfung aus.
- `build` erzeugt den Produktions-Build.
- `check:links` kontrolliert interne Links im erzeugten Build.
- `check:deployment` prüft 404-Seite, robots.txt, Canonical URL und Sitemap.
- `quality` führt alle Prüfungen in der vorgesehenen Reihenfolge aus.

Der Workflow `.github/workflows/quality.yml` führt die reproduzierbare
Installation und `npm run quality` für Pull Requests und Änderungen an `main`
aus. Ein Deployment ist bewusst nicht enthalten.

## Inhalte pflegen

Seiten liegen unter `src/pages/`. Kurze redaktionelle Detailseiten werden als
Markdown gepflegt und verwenden `src/layouts/ContentPageLayout.astro`.

Vorbereitete Fallstudien liegen unter `src/content/projects/`. Neue Fallstudien
orientieren sich an `fallstudie-vorlage.md`. Solange `draft: true` gesetzt ist,
wird keine öffentliche Route erzeugt.

Rechtliche, persönliche oder projektspezifische Platzhalter dürfen erst nach
ausdrücklicher Freigabe veröffentlicht werden.

## Branch- und Review-Verfahren

1. Änderungen entstehen auf einem Arbeitsbranch.
2. Vor dem Commit wird `npm run quality` ausgeführt.
3. Der Branch wird zu GitHub gepusht.
4. Änderungen an `main` erfolgen ausschließlich über einen geprüften Pull Request.
5. Veröffentlichung und GitHub Pages werden getrennt freigegeben und eingerichtet.

Direkte Pushes auf `main`, automatische Pull Requests und automatische
Veröffentlichungen sind nicht Teil dieses Projektschritts.

## Hosting und Veröffentlichung

Die Website ist für eine spätere Veröffentlichung über GitHub Pages vorbereitet.
Der Workflow `.github/workflows/deploy-pages.yml` baut den statischen Inhalt aus
`main` und veröffentlicht ausschließlich das Verzeichnis `dist/`. Er wird
ausschließlich manuell über `workflow_dispatch` gestartet; ein Merge oder Push
auf `main` löst keine Veröffentlichung aus.

Eine Veröffentlichung ist standardmäßig technisch gesperrt. Beide Jobs werden
nur ausgeführt, wenn im Repository die Variable `SANELIO_PAGES_ENABLED` exakt auf
`true` gesetzt wurde. Die Variable darf erst nach gesonderter Freigabe gesetzt
werden.

Vor der ersten Veröffentlichung müssen zusätzlich:

1. die fehlenden rechtlichen und persönlichen Angaben freigegeben sein,
2. `kontakt@sanelio.de` als erreichbare Adresse verifiziert sein,
3. GitHub Pages mit der Quelle „GitHub Actions“ aktiviert sein,
4. `sanelio.de` in den Pages-Einstellungen als Custom Domain hinterlegt und
   verifiziert sein,
5. die erforderlichen DNS-Einträge kontrolliert auf GitHub Pages umgestellt
   worden sein.

Bis diese Voraussetzungen erfüllt sind, bleibt die bestehende DNS- und
Hostingkonfiguration unverändert. Es gibt bewusst keinen öffentlichen
Preview-Deploymentdienst. Pull Requests werden durch den Quality-Workflow
geprüft; eine lokale Produktionsvorschau erfolgt mit `npm run preview`.

### Rollback

Ein veröffentlichter Stand wird nicht durch direkte Änderungen an `main`
zurückgesetzt. Für einen inhaltlichen oder technischen Rollback wird auf einem
neuen Branch ein Revert des betroffenen Commits vorbereitet, vollständig geprüft
und über einen Pull Request nach `main` übernommen. Der Pages-Workflow
veröffentlicht anschließend den wiederhergestellten Stand. Eine Deaktivierung von
GitHub Pages oder Änderung der Domain bleibt eine separate, ausdrücklich
freizugebende administrative Maßnahme.
