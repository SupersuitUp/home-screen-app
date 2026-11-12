/** Past this many pixels the screen's own Back is off the top of the screen. */
export declare const REVEAL_PAST: number
/** Scrolling up this far shows the floating Back; a twitch of the thumb does not. */
export declare const REVEAL_UP: number
/** Scrolling down this far hides it again. */
export declare const HIDE_DOWN: number

export interface BackReveal {
  /** Where the screen was last seen. */
  y: number
  /** -1 scrolling up, 1 down, 0 not yet moved. */
  dir: -1 | 0 | 1
  /** Where the current direction began. */
  from: number
  shown: boolean
}
export interface BackRevealOptions { revealPast?: number; revealUp?: number; hideDown?: number }
export declare function backRevealAt(y: number): BackReveal
export declare function backReveal(prev: BackReveal, y: number, options?: BackRevealOptions): BackReveal

export type NotifyState = 'install' | 'ask' | 'denied' | 'on' | 'hidden'
export interface NotifyFacts {
  /** serviceWorker, PushManager and Notification all exist. */
  hasPush: boolean
  /** Opened from the Home Screen. */
  standalone: boolean
  ios: boolean
  permission: 'default' | 'granted' | 'denied' | 'unknown'
  subscribed: boolean
}
export declare function notifyState(facts: NotifyFacts): NotifyState
export declare function isIOS(userAgent: string, maxTouchPoints?: number): boolean
export declare function keyBytes(base64url: string): Uint8Array<ArrayBuffer>

/** The longest name a Home Screen label shows before the phone cuts it. */
export declare const SHORTCUT_NAME_MAX: number
/** One page of the app, saved to the Home Screen as its own icon. */
export interface Shortcut { start: string; name: string | null }
/** A shortcut to `start`, or null when it is not a page on this site (or carries a refused parameter). */
export declare function shortcutOf(start: unknown, name: unknown, options?: { refuse?: string[] }): Shortcut | null
/** The manifest link's href for a page that is a shortcut. */
export declare function shortcutHref(shortcut: Shortcut, manifestPath?: string): string
/** The app's manifest made into the shortcut's: its start_url, its own id, its name, and its icons when given. */
export declare function shortcutManifest<M extends { name?: string; short_name?: string }>(manifest: M, shortcut: Shortcut | null, options?: { icons?: unknown[] }): M & { id?: string; start_url?: string }
export type AddHow = 'share-sheet' | 'browser-menu' | 'open-in-browser' | 'on-phone'
/** How to put this page on the Home Screen from where the person is, as steps to show them. */
export declare function addToHomeScreen(facts?: { ios?: boolean; android?: boolean; standalone?: boolean }): { how: AddHow; steps: string[] }
export declare function isAndroid(userAgent: string): boolean
