# @supersuit/home-screen-app

The small rules a web app saved to a phone's Home Screen keeps getting wrong, as pure functions
you can test: when a floating Back button should show, and what the notifications line should
say. No dependencies, no framework; your component gathers the facts and renders the answer.

```bash
npm i @supersuit/home-screen-app
```

## A floating Back button

A Back button at the top of a long screen scrolls away with it. Once the screen is past its own
Back, scrolling up a little brings a floating copy in; scrolling down, or reaching the top, takes
it away.

```js
import { backReveal, backRevealAt } from '@supersuit/home-screen-app'

let state = backRevealAt(window.scrollY)
window.addEventListener('scroll', () => {
  const next = backReveal(state, window.scrollY)       // the same object when nothing moved
  if (next !== state) { state = next; floatingBack.hidden = !state.shown }
}, { passive: true })
```

The distances are options, with the defaults shown: `backReveal(state, y, { revealPast: 96,
revealUp: 24, hideDown: 8 })`. `revealPast` is how far down the screen's own Back is out of
view, `revealUp` how far an upward scroll must go to show the copy, `hideDown` how far a downward
one must go to hide it.

## The notifications line

```js
import { notifyState, isIOS, keyBytes } from '@supersuit/home-screen-app'

const state = notifyState({
  hasPush: 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window,
  standalone: matchMedia('(display-mode: standalone)').matches,
  ios: isIOS(navigator.userAgent, navigator.maxTouchPoints),
  permission: 'Notification' in window ? Notification.permission : 'unknown',
  subscribed: Boolean(await (await navigator.serviceWorker?.ready)?.pushManager.getSubscription()),
})
// 'install' (an iPhone in Safari: web push exists only once the app is on the Home Screen),
// 'ask', 'denied', 'on', or 'hidden' (this browser has no push)

// Subscribing wants the VAPID public key as bytes, not as the URL-safe base64 it is usually stored in.
await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID_PUBLIC_KEY) })
```

## License

MIT
