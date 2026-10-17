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
