/**
 * Draft state for one album, kept in React context for the length of the
 * flow. Persisting to Supabase (same `drafts` table as the web) is the next
 * step and slots in at `save()`; the screens never talk to the network
 * directly.
 */
import React, { createContext, useContext, useMemo, useState } from "react";
import type { Photo, Page } from "./album-layout";
import { layoutAlbum } from "./album-layout";
import type { Locale, Market } from "./i18n";

export type Occasion = "travel" | "birthday" | "baby" | "family" | "anniversary" | "artwork";
export const OCCASIONS: Occasion[] = ["travel", "birthday", "baby", "family", "anniversary", "artwork"];

export type Cover = { color: number; title: string; name: string; year: string; photo: number };

type State = {
  locale: Locale;
  market: Market;
  occasion: Occasion | null;
  pages: 20 | 40;
  photos: Photo[];
  layout: Page[];
  seed: number;
  cover: Cover;
};

type Api = State & {
  setLocale(l: Locale): void;
  setMarket(m: Market): void;
  pick(o: Occasion): void;
  setPages(p: 20 | 40): void;
  addPhotos(p: Photo[]): void;
  removePhoto(i: number): void;
  relayout(seed?: number): void;
  setCover(patch: Partial<Cover>): void;
  reset(): void;
  perPage: 1 | 4;
  capacity: number;
  minPhotos: number;
};

const defaultCover = (o: Occasion | null): Cover => ({
  color: o === "travel" ? 1 : o === "birthday" ? 2 : o === "baby" ? 6 : o === "family" ? 7 : o === "anniversary" ? 5 : 2,
  title: "",
  name: "",
  year: String(new Date().getFullYear()),
  photo: 0,
});

const initial: State = {
  locale: "en",
  market: "KW",
  occasion: null,
  pages: 20,
  photos: [],
  layout: [],
  seed: 0,
  cover: defaultCover(null),
};

const Ctx = createContext<Api | null>(null);

export function AlbumProvider({ children }: { children: React.ReactNode }) {
  const [s, set] = useState<State>(initial);
  const perPage: 1 | 4 = s.occasion === "artwork" ? 1 : 4;
  const capacity = s.pages * perPage;
  const minPhotos = s.pages; // at least one per page, never an empty page

  const api = useMemo<Api>(
    () => ({
      ...s,
      perPage,
      capacity,
      minPhotos,
      setLocale: (locale) => set((x) => ({ ...x, locale })),
      setMarket: (market) => set((x) => ({ ...x, market })),
      pick: (occasion) => set((x) => ({ ...x, occasion, cover: defaultCover(occasion), photos: [], layout: [] })),
      setPages: (pages) => set((x) => ({ ...x, pages })),
      addPhotos: (p) =>
        set((x) => {
          const cap = x.pages * (x.occasion === "artwork" ? 1 : 4);
          return { ...x, photos: [...x.photos, ...p].slice(0, cap) };
        }),
      removePhoto: (i) => set((x) => ({ ...x, photos: x.photos.filter((_, k) => k !== i) })),
      relayout: (seed = 0) =>
        set((x) => ({
          ...x,
          seed,
          layout: layoutAlbum(x.photos, { pages: x.pages, perPage: x.occasion === "artwork" ? 1 : 4, seed }),
        })),
      setCover: (patch) => set((x) => ({ ...x, cover: { ...x.cover, ...patch } })),
      reset: () => set((x) => ({ ...initial, locale: x.locale, market: x.market })),
    }),
    [s, perPage, capacity, minPhotos],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAlbum(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAlbum outside AlbumProvider");
  return v;
}
