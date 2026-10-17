// What a Home Screen web app's notifications line should say, from what this browser can do.
// Pure, so every state is tested; the component only gathers the facts.

/**
 * 'install' (an iPhone in Safari: web push exists only for an app saved to the Home Screen),
 * 'hidden' (no push in this browser), 'denied', 'on' (allowed and subscribed), or 'ask'.
 */
export function notifyState({ hasPush, standalone, ios, permission, subscribed }) {
  // An iPhone only offers web push to an app saved to the Home Screen; in Safari it has no
  // PushManager at all, so the only useful thing to say is how to install it.
  if (ios && !standalone) return 'install'
  if (!hasPush) return 'hidden'
  if (permission === 'denied') return 'denied'
  if (permission === 'granted' && subscribed) return 'on'
  return 'ask'
}

/** An iPhone or iPod, or an iPad, which reports itself as a Mac with a touch screen. */
export function isIOS(ua, maxTouchPoints = 0) {
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1)
}

/** A VAPID public key is URL-safe base64; PushManager.subscribe wants the raw bytes. */
export function keyBytes(base64url) {
  const b64 = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}
