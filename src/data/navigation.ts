export const basePath = import.meta.env.BASE_URL;

export function withBase(path: string) {
  return path === "/" ? basePath : `${basePath}${path.slice(1)}`;
}

export const navigation = [
  { href: withBase("/"), label: "Start" },
  { href: withBase("/technologie-verstehen/"), label: "Technologie verstehen" },
  { href: withBase("/prime/"), label: "Prime" },
  { href: withBase("/projekte/"), label: "Projekte" },
  { href: withBase("/ueber-sanelio/"), label: "Über Sanelio" },
] as const;
