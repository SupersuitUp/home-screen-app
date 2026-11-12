// A HOME-SCREEN SHORTCUT to one page of a web app: a tile, a screen, a deep link, saved to a phone's
// Home Screen as its own icon that opens right there.
//
// Learned on the Helm (2026-11-10): "After saving to the home screen, it just goes to the home page".
// A phone reads the manifest link and the apple-mobile-web-app-title THE PAGE LOADED WITH when
// "Add to Home Screen" is tapped, and uses that manifest's start_url. So the page's own HTML, as the
// server sends it, must point its manifest link at a manifest whose start_url is that page. A link
// swapped in by script afterwards makes an icon that opens the app's home.
//
// The manifest also gets its own `id` (the page), because Android treats two manifests with one id
// as one installed app and will not add a second icon.

/** The longest name a Home Screen label shows before the phone cuts it. */
export const SHORTCUT_NAME_MAX = 30

/**
 * A shortcut to `start`, or null when `start` is not a page on this site: it must be a path that
 * begins with one slash, holds no space, backslash or fragment, is not under /api, and carries none
 * of the `refuse` query parameters (a key or a token must never be baked into an icon). The name is
 * cleaned of control characters and angle brackets and cut to SHORTCUT_NAME_MAX; an empty one is null.
 */
export function shortcutOf(start, name, { refuse = [] } = {}) {
  if (typeof start !== 'string' || start.length > 400) return null
  if (!/^\/(?![\/\\])[^\s\\#]*$/.test(start) || /^\/api(\/|$|\?)/.test(start)) return null
  const q = start.indexOf('?')
  if (q >= 0) {
    const params = new URLSearchParams(start.slice(q + 1))
    if (refuse.some((p) => params.has(p))) return null
  }
  const n = typeof name === 'string' ? name.replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, SHORTCUT_NAME_MAX).trim() : ''
  return { start, name: n || null }
}

/** The manifest link's href for a page that is a shortcut: the app's manifest, told where to start. */
export function shortcutHref(shortcut, manifestPath = '/manifest.webmanifest') {
  const q = `start=${encodeURIComponent(shortcut.start)}${shortcut.name ? `&name=${encodeURIComponent(shortcut.name)}` : ''}`
  return `${manifestPath}?${q}`
}

/**
 * The app's manifest made into the shortcut's: it starts at the page, under the page's own id, with
 * the page's name and, when given, the page's icons. Scope stays the app's, so the rest of the app
 * still opens inside the same icon. With no shortcut it is the app's manifest unchanged.
 */
export function shortcutManifest(manifest, shortcut, { icons } = {}) {
  if (!shortcut) return manifest
  const name = shortcut.name ?? manifest.name
  return {
    ...manifest,
    id: shortcut.start,
    start_url: shortcut.start,
    name,
    short_name: shortcut.name ?? manifest.short_name ?? name,
    ...(icons ? { icons } : {}),
  }
}

/**
 * How to put this page on the Home Screen from where the person is, as steps to show them.
 *   'share-sheet'     an iPhone or iPad in Safari
 *   'browser-menu'    an Android phone in Chrome
 *   'open-in-browser' already inside a Home Screen app, where there is no Share sheet or menu:
 *                     copy the link, open it in the browser, add it from there
 *   'on-phone'        a computer: open the link on the phone
 */
export function addToHomeScreen({ ios = false, android = false, standalone = false } = {}) {
  if (standalone && ios) return { how: 'open-in-browser', steps: [
    'Tap Copy link.',
    'Open Safari and paste the link in the address bar.',
    'Tap the Share button, then tap Add to Home Screen.',
  ] }
  if (standalone) return { how: 'open-in-browser', steps: [
    'Tap Copy link.',
    'Open Chrome and paste the link in the address bar.',
    'Tap the menu, then tap Add to Home screen.',
  ] }
  if (ios) return { how: 'share-sheet', steps: [
    'Tap the Share button at the bottom of Safari.',
    'Scroll down and tap Add to Home Screen.',
    'Tap Add.',
  ] }
  if (android) return { how: 'browser-menu', steps: [
    'Tap the menu at the top right of Chrome.',
    'Tap Add to Home screen.',
    'Tap Add.',
  ] }
  return { how: 'on-phone', steps: [
    'Tap Copy link and send it to your phone.',
    'Open the link on your phone.',
    'Add it to your Home Screen from the Share button or the browser menu.',
  ] }
}

/** True on an Android phone or tablet. */
export function isAndroid(ua) {
  return /Android/i.test(ua)
}
