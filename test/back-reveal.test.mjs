// Ported from the cofounders and first-years templates' back-reveal.test.ts (2026-10-17), plus the options.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HIDE_DOWN, REVEAL_PAST, REVEAL_UP, backReveal, backRevealAt } from '../src/index.mjs'

const after = (...ys) => ys.slice(1).reduce((s, y) => backReveal(s, y), backRevealAt(ys[0]))

test('stays away while the screen only scrolls down', () => {
  assert.equal(after(0, 200, 600, 1400).shown, false)
})
test('shows once the screen is scrolled back up a little, mid-page, in one step or small ones', () => {
  assert.equal(after(0, 1400, 1400 - REVEAL_UP).shown, true)
  assert.equal(after(0, 1400, 1392, 1384, 1376).shown, true)
})
test('ignores a twitch of the thumb', () => {
  assert.equal(after(0, 1400, 1400 - REVEAL_UP + 1).shown, false)
})
test('goes away when the screen scrolls down again, and comes back on the next scroll up', () => {
  const up = after(0, 1400, 1300)
  assert.equal(up.shown, true)
  assert.equal(backReveal(up, 1300 + HIDE_DOWN - 1).shown, true)
  const down = backReveal(up, 1300 + HIDE_DOWN)
  assert.equal(down.shown, false)
  assert.equal(backReveal(down, 1300 + HIDE_DOWN - REVEAL_UP).shown, true)
})
test("stays while the screen keeps scrolling up, until the screen's own Back is in view", () => {
  assert.equal(after(0, 1400, 1300, 900, 400, REVEAL_PAST + 1).shown, true)
  assert.equal(after(0, 1400, 1300, 900, 400, REVEAL_PAST).shown, false)
  assert.equal(after(0, 1400, 1300, 0).shown, false)
})
test("never shows near the top, where the screen's own Back is, nor on an overscroll bounce", () => {
  assert.equal(after(0, REVEAL_PAST, 40, 10).shown, false)
  assert.equal(after(0, 60, -30, 0).shown, false)
})
test('is unchanged, by identity, by a scroll event that did not move', () => {
  const s = after(0, 1400, 1300)
  assert.equal(backReveal(s, 1300), s)
})
test('every distance is an option: a taller header, a lazier reveal, a stickier hide', () => {
  const opts = { revealPast: 300, revealUp: 100, hideDown: 50 }
  const run = (...ys) => ys.slice(1).reduce((s, y) => backReveal(s, y, opts), backRevealAt(ys[0]))
  assert.equal(run(0, 1400, 1376).shown, false, 'the default 24 px is not enough at revealUp 100')
  assert.equal(run(0, 1400, 1300).shown, true)
  assert.equal(backReveal(run(0, 1400, 1300), 1340, opts).shown, true, 'a 40 px scroll down does not hide at hideDown 50')
  assert.equal(run(0, 1400, 1300, 299).shown, false, 'inside revealPast it is the screen own Back')
})
