/**
 * Album layout engine.
 *
 * Fills every page of a 20 or 40 page album with 1 to 4 photos, keeping the
 * customer's order, never cropping a photo and never leaving a page empty.
 *
 * The rules Khaled set on 12 Nov:
 *   - no crop, ever (a crop can cut a face)
 *   - no white holes: a photo that does not fill its cell sits on a soft blur
 *     of itself, which the renderer draws, not this module
 *   - 20 pages hold up to 80 photos, 40 pages up to 160 (4 per page)
 *   - the artwork product is 1 drawing per page, no exceptions
 *
 * Pure functions, no React, so it can be unit tested and reused by the web.
 */

export type Photo = {
  uri: string;
  width: number;
  height: number;
};

export type Orientation = "landscape" | "portrait" | "square";

/** A CSS-grid style placement: 1-based line numbers, end exclusive. */
export type Area = {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
};

export type PageTemplate = {
  /** fr units per column, e.g. [1, 1] */
  cols: number[];
  /** fr units per row */
  rows: number[];
  /** one area per photo, in the order of `photos` */
  areas: Area[];
};

export type Page = {
  photos: Photo[];
  template: PageTemplate;
};

export const PHOTOS_PER_PAGE_MAX = 4;

export function orientation(p: Photo): Orientation {
  const r = p.width / p.height;
  if (r > 1.15) return "landscape";
  if (r < 0.87) return "portrait";
  return "square";
}

export function ratio(p: Photo): number {
  return p.width / p.height;
}

/** How many photos the product accepts. */
export function capacity(pages: 20 | 40, perPage: 1 | 4 = 4): number {
  return pages * perPage;
}

/**
 * Split N photos over P pages, 1..max per page, spread evenly.
 *
 * 48 photos on 20 pages is not "4,4,4,...,0,0": it is twelve pages of 2 and
 * eight pages of 3, alternated so the heavier pages do not all sit at the
 * front. Fewer photos than pages yields fewer pages, never an empty one; the
 * caller decides whether that is allowed (it is not for checkout).
 */
export function distribute(n: number, pages: number, max = PHOTOS_PER_PAGE_MAX): number[] {
  if (n <= 0) return [];
  const p = Math.min(pages, n);
  const base = Math.floor(n / p);
  const extra = n - base * p;
  const counts: number[] = [];
  for (let i = 0; i < p; i++) counts.push(Math.min(max, base + (i < extra ? 1 : 0)));
  // Alternate heavy and light pages: sort ascending, then take from both ends.
  const sorted = [...counts].sort((a, b) => a - b);
  const out: number[] = [];
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo <= hi) {
    out.push(sorted[hi--]);
    if (lo <= hi) out.push(sorted[lo++]);
  }
  return out;
}

const A = (rowStart: number, rowEnd: number, colStart: number, colEnd: number): Area => ({
  rowStart,
  rowEnd,
  colStart,
  colEnd,
});

/**
 * Pick a grid for one page from the photos' shapes.
 *
 * Cells are sized by aspect ratio where it matters (two portraits side by
 * side get widths proportional to their ratios), so the contain-fit leaves
 * as little margin as the shapes allow. The renderer fills what is left with
 * the blurred photo.
 *
 * Returns the template and the photo order it expects, because a 3-up page
 * puts the landscape (or the portrait) in the big cell regardless of where
 * it came in the sequence.
 */
export function templateFor(photos: Photo[]): { template: PageTemplate; order: Photo[] } {
  const k = photos.length;
  const r = photos.map(ratio);
  const o = photos.map(orientation);

  if (k === 1) {
    return { template: { cols: [1], rows: [1], areas: [A(1, 2, 1, 2)] }, order: photos };
  }

  if (k === 2) {
    const bothPortrait = o[0] === "portrait" && o[1] === "portrait";
    const bothLandscape = o[0] === "landscape" && o[1] === "landscape";
    if (bothLandscape) {
      // stacked: row heights inversely proportional to ratio
      return {
        template: { cols: [1], rows: [1 / r[0], 1 / r[1]], areas: [A(1, 2, 1, 2), A(2, 3, 1, 2)] },
        order: photos,
      };
    }
    // side by side (portraits, squares, or mixed): widths proportional to ratio
    const widths = bothPortrait ? [r[0], r[1]] : [r[0], r[1]];
    return {
      template: { cols: widths, rows: [1], areas: [A(1, 2, 1, 2), A(1, 2, 2, 3)] },
      order: photos,
    };
  }

  if (k === 3) {
    const li = o.indexOf("landscape");
    if (li >= 0) {
      // landscape on top, two below
      const rest = photos.filter((_, i) => i !== li);
      return {
        template: { cols: [1, 1], rows: [1.15, 1], areas: [A(1, 2, 1, 3), A(2, 3, 1, 2), A(2, 3, 2, 3)] },
        order: [photos[li], ...rest],
      };
    }
    const pi = o.indexOf("portrait");
    const big = pi >= 0 ? pi : 0;
    const rest = photos.filter((_, i) => i !== big);
    // tall one on the start side, two stacked beside it
    return {
      template: { cols: [1.05, 1], rows: [1, 1], areas: [A(1, 3, 1, 2), A(1, 2, 2, 3), A(2, 3, 2, 3)] },
      order: [photos[big], ...rest],
    };
  }

  // 4: a 2x2 grid; pair portraits with portraits in a row when possible so
  // the rows do not fight each other for height.
  const portraits = photos.filter((p) => orientation(p) === "portrait");
  const others = photos.filter((p) => orientation(p) !== "portrait");
  const ordered = portraits.length === 2 ? [...portraits, ...others] : photos;
  return {
    template: {
      cols: [1, 1],
      rows: [1, 1],
      areas: [A(1, 2, 1, 2), A(1, 2, 2, 3), A(2, 3, 1, 2), A(2, 3, 2, 3)],
    },
    order: ordered,
  };
}

export type LayoutOptions = {
  pages: 20 | 40;
  /** 1 for the artwork product, 4 for photo albums */
  perPage?: 1 | 4;
  /**
   * 0 keeps the customer's order exactly. Any other value shuffles
   * neighbours in pairs and reorders the page density pattern, so "shuffle"
   * gives a visibly different book without sending photo 50 to page 1.
   */
  seed?: number;
};

export function layoutAlbum(photos: Photo[], opts: LayoutOptions): Page[] {
  const perPage = opts.perPage ?? PHOTOS_PER_PAGE_MAX;
  const seed = opts.seed ?? 0;
  const cap = capacity(opts.pages, perPage);
  const input = photos.slice(0, cap);
  if (input.length === 0) return [];

  const rnd = mulberry32(seed);
  const order = input.map((_, i) => i);
  if (seed !== 0) {
    for (let i = 0; i + 1 < order.length; i += 2) {
      if (rnd() < 0.5) [order[i], order[i + 1]] = [order[i + 1], order[i]];
    }
  }

  let counts = distribute(input.length, opts.pages, perPage);
  if (seed !== 0) counts = shuffle(counts, rnd);

  const pages: Page[] = [];
  let cursor = 0;
  for (const k of counts) {
    const slice: Photo[] = [];
    for (let j = 0; j < k && cursor < order.length; j++) slice.push(input[order[cursor++]]);
    if (slice.length === 0) break;
    const { template, order: ordered } = templateFor(slice);
    pages.push({ photos: ordered, template });
  }
  return pages;
}

/** Deterministic PRNG so a seed reproduces the same book. */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Resolve a template into absolute rectangles for a square page of `size`
 * points with `gap` between cells. React Native has no CSS grid, so screens
 * position cells absolutely from this.
 */
export type Rect = { x: number; y: number; w: number; h: number };

export function resolveRects(t: PageTemplate, size: number, gap: number, padding: number): Rect[] {
  const inner = size - padding * 2;
  const colSum = t.cols.reduce((a, b) => a + b, 0);
  const rowSum = t.rows.reduce((a, b) => a + b, 0);
  const colW = (inner - gap * (t.cols.length - 1)) / colSum;
  const rowH = (inner - gap * (t.rows.length - 1)) / rowSum;
  const colX: number[] = [padding];
  for (let i = 0; i < t.cols.length; i++) colX.push(colX[i] + t.cols[i] * colW + gap);
  const rowY: number[] = [padding];
  for (let i = 0; i < t.rows.length; i++) rowY.push(rowY[i] + t.rows[i] * rowH + gap);
  return t.areas.map((a) => ({
    x: colX[a.colStart - 1],
    y: rowY[a.rowStart - 1],
    w: colX[a.colEnd - 1] - colX[a.colStart - 1] - gap,
    h: rowY[a.rowEnd - 1] - rowY[a.rowStart - 1] - gap,
  }));
}
