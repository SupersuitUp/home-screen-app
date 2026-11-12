import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shortcutOf, shortcutHref, shortcutManifest, addToHomeScreen, SHORTCUT_NAME_MAX } from '../src/index.mjs'

test('shortcutOf takes a path on this site and a short name', () => {
  assert.deepEqual(shortcutOf('/notes', 'Notes'), { start: '/notes', name: 'Notes' })
  assert.deepEqual(shortcutOf('/p/broadcast?to=app:us', ' Broadcast '), { start: '/p/broadcast?to=app:us', name: 'Broadcast' })
})

test('shortcutOf refuses anything that would open somewhere other than a page on this site', () => {
  for (const bad of [undefined, null, '', 'notes', 'https://evil.example/notes', '//evil.example', '/\\evil', '/a b', '/notes#x', '/api', '/api/us/notes', '/api?x=1', '/' + 'a'.repeat(400)]) {
    assert.equal(shortcutOf(bad, 'Notes'), null, String(bad))
  }
})

test('shortcutOf refuses a start that carries a refused parameter, such as a key', () => {
  assert.equal(shortcutOf('/notes?k=secret', 'Notes', { refuse: ['k'] }), null)
  assert.equal(shortcutOf('/notes?a=1&k=secret', 'Notes', { refuse: ['k'] }), null)
  assert.deepEqual(shortcutOf('/notes?kind=1', 'Notes', { refuse: ['k'] }), { start: '/notes?kind=1', name: 'Notes' })
})

test('shortcutOf cleans the name and cuts it to what a Home Screen label holds', () => {
  assert.equal(shortcutOf('/x', 'a<b>\u0007c').name, 'abc')
  assert.equal(shortcutOf('/x', 'n'.repeat(80)).name.length, SHORTCUT_NAME_MAX)
  assert.equal(shortcutOf('/x', '   ').name, null)
  assert.equal(shortcutOf('/x', undefined).name, null)
})

test('shortcutHref points the manifest link at this one page', () => {
  assert.equal(shortcutHref({ start: '/notes', name: 'Notes' }), '/manifest.webmanifest?start=%2Fnotes&name=Notes')
  assert.equal(shortcutHref({ start: '/a?b=1', name: 'To bring up' }, '/app.webmanifest'), '/app.webmanifest?start=%2Fa%3Fb%3D1&name=To%20bring%20up')
  assert.equal(shortcutHref({ start: '/notes', name: null }), '/manifest.webmanifest?start=%2Fnotes')
})

const BASE = { id: '/', name: 'Us', short_name: 'Us', start_url: '/', scope: '/', display: 'standalone', icons: [{ src: '/i.png', sizes: '512x512' }] }

test('shortcutManifest opens the page, under its own id, so a phone keeps it apart from the app', () => {
  const m = shortcutManifest(BASE, { start: '/notes', name: 'Notes' })
  assert.equal(m.start_url, '/notes')
  assert.equal(m.id, '/notes')
  assert.equal(m.name, 'Notes')
  assert.equal(m.short_name, 'Notes')
  assert.equal(m.scope, '/')
  assert.equal(m.display, 'standalone')
  assert.deepEqual(m.icons, BASE.icons)
  assert.equal(BASE.start_url, '/', 'the app manifest is not changed')
})

test('shortcutManifest keeps the app name when the shortcut has none, and takes the page icons when given', () => {
  const icons = [{ src: '/home-icon/notes?size=512', sizes: '512x512', type: 'image/png' }]
  const m = shortcutManifest(BASE, { start: '/notes', name: null }, { icons })
  assert.equal(m.name, 'Us')
  assert.deepEqual(m.icons, icons)
})

test('shortcutManifest with no shortcut is the app manifest', () => {
  assert.deepEqual(shortcutManifest(BASE, null), BASE)
})

test('addToHomeScreen: an iPhone in Safari adds it from the Share sheet', () => {
  const r = addToHomeScreen({ ios: true, android: false, standalone: false })
  assert.equal(r.how, 'share-sheet')
  assert.match(r.steps.join(' '), /Share/)
  assert.match(r.steps.join(' '), /Add to Home Screen/)
})

test('addToHomeScreen: inside the Home Screen app there is no Share sheet, so the page opens in the browser first', () => {
  const ios = addToHomeScreen({ ios: true, android: false, standalone: true })
  assert.equal(ios.how, 'open-in-browser')
  assert.match(ios.steps.join(' '), /Safari/)
  const android = addToHomeScreen({ ios: false, android: true, standalone: true })
  assert.equal(android.how, 'open-in-browser')
  assert.match(android.steps.join(' '), /Chrome/)
})

test('addToHomeScreen: Android in Chrome adds it from the menu', () => {
  const r = addToHomeScreen({ ios: false, android: true, standalone: false })
  assert.equal(r.how, 'browser-menu')
  assert.match(r.steps.join(' '), /Add to Home screen/)
})

test('addToHomeScreen: a computer sends it to the phone', () => {
  const r = addToHomeScreen({ ios: false, android: false, standalone: false })
  assert.equal(r.how, 'on-phone')
  assert.match(r.steps.join(' '), /phone/)
})

test('every step is one short sentence', () => {
  for (const f of [{ ios: true, standalone: false }, { ios: true, standalone: true }, { android: true, standalone: false }, { android: true, standalone: true }, {}]) {
    for (const s of addToHomeScreen(f).steps) {
      assert.ok(s.split(/\s+/).length <= 20, s)
      assert.match(s, /\.$/)
    }
  }
})
