import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const outputDirectory = resolve("dist");

if (!existsSync(outputDirectory)) {
  console.error("dist/ fehlt. Bitte zuerst npm run build ausführen.");
  process.exit(1);
}

function collectHtmlFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory()
      ? collectHtmlFiles(path)
      : path.endsWith(".html")
        ? [path]
        : [];
  });
}

function targetFor(pathname) {
  const decodedPath = decodeURIComponent(pathname);

  if (decodedPath === "/") {
    return join(outputDirectory, "index.html");
  }

  if (decodedPath.endsWith("/")) {
    return join(outputDirectory, decodedPath, "index.html");
  }

  const directTarget = join(outputDirectory, decodedPath);
  return existsSync(directTarget)
    ? directTarget
    : join(outputDirectory, decodedPath, "index.html");
}

const failures = [];
let checkedLinks = 0;

for (const htmlFile of collectHtmlFiles(outputDirectory)) {
  const html = readFileSync(htmlFile, "utf8");
  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

  for (const href of links) {
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("http://") ||
      href.startsWith("https://")
    ) {
      continue;
    }

    const pathname = href.split(/[?#]/, 1)[0];
    if (!pathname.startsWith("/")) {
      failures.push(
        `${htmlFile}: relativer Link ohne führenden Slash: ${href}`,
      );
      continue;
    }

    checkedLinks += 1;
    if (!existsSync(targetFor(pathname))) {
      failures.push(`${htmlFile}: Ziel fehlt: ${href}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Interne Linkprüfung bestanden: ${checkedLinks} Links in ${collectHtmlFiles(outputDirectory).length} HTML-Dateien.`,
);
