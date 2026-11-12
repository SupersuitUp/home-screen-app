# Changelog

## 0.2.0 (2026-11-12)

- One page as its own Home Screen icon: `shortcutOf` (a page on this site, never /api, a fragment or a
  refused key), `shortcutHref` (the manifest link the page's own HTML carries), `shortcutManifest` (the
  app's manifest started at that page, under its own id so Android keeps it apart) and
  `addToHomeScreen` (the steps from Safari, Chrome, inside the Home Screen app, or a computer), with
  `isAndroid`. Lifted from the Helm's 2026-11-10 fix ("After saving to the home screen, it just goes to
  the home page") so every living template's tiles can be saved the same way.

## 0.1.0 (2026-10-17)

- First release, extracted from the cofounders and first-years templates, where the same two files
  had been copied: `backReveal` / `backRevealAt` (when a floating Back shows, with its three
  distances now options) and `notifyState` / `isIOS` / `keyBytes` (what a Home Screen app's
  notifications line says, and the VAPID key bytes `pushManager.subscribe` wants).
