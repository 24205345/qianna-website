/** Keep the Workbench entry point on note links, including query strings and anchors. */
export function getWorkbenchNoteHref(href: string): string {
  const base = "https://www.qiannawang.com";
  if (!href.startsWith("/notes/") && !href.startsWith(`${base}/notes/`)) {
    return href;
  }

  const url = new URL(href, base);

  if (url.origin !== base || !/^\/notes\/[^/]+\/?$/.test(url.pathname)) {
    return href;
  }

  url.searchParams.set("from", "workbench");
  return `${url.pathname}${url.search}${url.hash}`;
}
