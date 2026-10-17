// Ported from the cofounders and first-years templates' notify-state.test.ts (2026-10-17).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { notifyState, isIOS, keyBytes } from '../src/index.mjs'

const f = (o = {}) => ({ hasPush: true, standalone: true, ios: true, permission: 'default', subscribed: false, ...o })

test('an iPhone in Safari is told to add the app to the Home Screen', () => {
  assert.equal(notifyState(f({ standalone: false, hasPush: false })), 'install')
})
test('asks when nobody has answered, or when allowed but this phone is not subscribed', () => {
  assert.equal(notifyState(f()), 'ask')
  assert.equal(notifyState(f({ permission: 'granted' })), 'ask')
})
test('is on when allowed and subscribed, and says so when blocked', () => {
  assert.equal(notifyState(f({ permission: 'granted', subscribed: true })), 'on')
  assert.equal(notifyState(f({ permission: 'denied' })), 'denied')
})
test('a browser with no push shows nothing', () => {
  assert.equal(notifyState(f({ ios: false, standalone: false, hasPush: false })), 'hidden')
})
test('recognises an iPhone, and an iPad that says it is a Mac', () => {
  assert.equal(isIOS('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'), true)
  assert.equal(isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5), true)
  assert.equal(isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0), false)
  assert.equal(isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 1), false, 'one touch point is a Mac, not an iPad')
})
test('turns a url-safe base64 key into bytes, padding it as needed', () => {
  assert.deepEqual([...keyBytes('AQID-_8')], [1, 2, 3, 251, 255])
  assert.deepEqual([...keyBytes('AQ')], [1])
  assert.deepEqual([...keyBytes('AQID')], [1, 2, 3], 'a key that needs no padding gets none')
})
