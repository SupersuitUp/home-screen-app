// When a floating Back button should show. A Back at the top of a long screen scrolls away with
// it, and the only way back to it was scrolling all the way up. So once the screen has scrolled
// past its own Back, scrolling UP a little brings a floating copy in, and scrolling down again or
// reaching the top takes it away: the gesture a phone browser's own toolbar answers to.
//
// Pure: feed it scroll positions, it says whether the floating Back shows. The component only
// listens to scroll events. Every distance is an option, with the defaults the first two apps used.

/** Past this many pixels the screen's own Back is off the top of the screen. */
export const REVEAL_PAST = 96
/** Scrolling up this far shows it; a twitch of the thumb does not. */
export const REVEAL_UP = 24
/** Scrolling down this far hides it again. */
export const HIDE_DOWN = 8

/** The state at a scroll position with no movement seen yet. */
export const backRevealAt = (y) => ({ y, dir: 0, from: y, shown: false })

/**
 * The next state after the screen is seen at `y`. Returns `prev` itself when nothing moved, so a
 * component can skip a render by identity.
 */
export function backReveal(prev, y, { revealPast = REVEAL_PAST, revealUp = REVEAL_UP, hideDown = HIDE_DOWN } = {}) {
  // At the top the screen's own Back is in view (and an overscroll bounce reads as negative).
  if (y <= revealPast) return backRevealAt(y)
  if (y === prev.y) return prev
  const dir = y < prev.y ? -1 : 1
  const from = dir === prev.dir ? prev.from : prev.y
  const moved = Math.abs(y - from)
  const shown = dir === -1 ? prev.shown || moved >= revealUp : prev.shown && moved < hideDown
  return { y, dir, from, shown }
}
