// This site serves English and French at the same URL (a client-side toggle,
// not locale-prefixed routes like /en/ or /fr/), so there's no separate URL per
// language to point hreflang at. Pointing every language variant — including
// x-default — at the same path is still valid, honest hreflang: it tells
// search engines this one URL serves both audiences, which avoids duplicate-
// content ambiguity even though it doesn't get the full benefit true
// per-locale URLs would.
export function hreflangAlternates(path: string) {
  return { en: path, fr: path, 'x-default': path };
}
