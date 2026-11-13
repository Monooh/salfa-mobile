/**
 * Checkout boundary.
 *
 * The app never talks to Tap or Supabase directly from a screen. This module
 * is the one place to wire the real flow, in this order:
 *
 *   1. upload the photos to the same storage bucket the web uses
 *   2. create the draft + order through the existing API (same tables, same
 *      prices, same market rules as salfa.app, nothing duplicated)
 *   3. open Tap's hosted page in an in-app browser (expo-web-browser) with a
 *      return URL on the app's scheme (salfa://pay/return?order=...)
 *   4. on return, confirm the order status with the server, never trust the
 *      redirect alone (the web learned this one on 26 Oct)
 *
 * Until the backend endpoints for the app exist, this resolves locally so
 * the flow can be exercised end to end on a device.
 */
import type { Page, Photo } from "./album-layout";
import type { Cover, Occasion } from "./album-store";
import type { Locale, Market } from "./i18n";

export type CheckoutInput = {
  occasion: Occasion;
  pages: 20 | 40;
  market: Market;
  locale: Locale;
  photos: Photo[];
  layout: Page[];
  cover: Cover;
};

export type CheckoutResult = { status: "paid"; orderNumber: string } | { status: "cancelled" } | { status: "failed"; reason: string };

export async function startCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  // TODO(backend): replace with createAlbumOrder() + Tap hosted checkout.
  await new Promise((r) => setTimeout(r, 900));
  const n = 10200 + Math.floor(Math.random() * 90);
  return { status: "paid", orderNumber: `QK-${n}` };
}
