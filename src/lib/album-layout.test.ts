import { test } from "node:test";
import assert from "node:assert/strict";
import { capacity, distribute, layoutAlbum, resolveRects, templateFor, type Photo } from "./album-layout.ts";

const ph = (w: number, h: number, i = 0): Photo => ({ uri: `p${i}`, width: w, height: h });
const mixed = (n: number): Photo[] =>
  Array.from({ length: n }, (_, i) => {
    const shapes = [
      [4, 3],
      [3, 4],
      [1, 1],
      [16, 9],
      [9, 16],
      [3, 2],
      [2, 3],
    ];
    const [w, h] = shapes[i % shapes.length];
    return ph(w * 100, h * 100, i);
  });

test("48 photos fill all 20 pages with 2 or 3 each, no empty page", () => {
  const counts = distribute(48, 20);
  assert.equal(counts.length, 20);
  assert.equal(counts.reduce((a, b) => a + b, 0), 48);
  assert.ok(counts.every((c) => c === 2 || c === 3));
  // alternated, not front loaded
  assert.notDeepEqual(counts.slice(0, 8), [3, 3, 3, 3, 3, 3, 3, 3]);
});

test("80 photos is 4 per page on 20 pages, 160 on 40", () => {
  assert.ok(distribute(80, 20).every((c) => c === 4));
  assert.ok(distribute(160, 40).every((c) => c === 4));
  assert.equal(capacity(20), 80);
  assert.equal(capacity(40), 160);
  assert.equal(capacity(40, 1), 40);
});

test("fewer photos than pages gives one per page and fewer pages, never empty ones", () => {
  const counts = distribute(12, 20);
  assert.equal(counts.length, 12);
  assert.ok(counts.every((c) => c === 1));
});

test("every photo lands exactly once, in order, with seed 0", () => {
  const photos = mixed(50);
  const pages = layoutAlbum(photos, { pages: 20 });
  const seen = pages.flatMap((p) => p.photos.map((x) => x.uri));
  assert.equal(seen.length, 50);
  assert.equal(new Set(seen).size, 50);
  // chronological at page level: first page photos come before second page photos in input
  const firstIdx = (p: { photos: Photo[] }) => Math.min(...p.photos.map((x) => photos.indexOf(x)));
  for (let i = 1; i < pages.length; i++) assert.ok(firstIdx(pages[i]) > firstIdx(pages[i - 1]));
});

test("extra photos beyond capacity are dropped, not crammed", () => {
  const pages = layoutAlbum(mixed(100), { pages: 20 });
  assert.equal(pages.flatMap((p) => p.photos).length, 80);
  assert.ok(pages.every((p) => p.photos.length <= 4));
});

test("artwork is strictly one drawing per page", () => {
  const pages = layoutAlbum(mixed(30), { pages: 20, perPage: 1 });
  assert.equal(pages.length, 20);
  assert.ok(pages.every((p) => p.photos.length === 1));
});

test("shuffle keeps the same photo set and the same page count", () => {
  const photos = mixed(48);
  const a = layoutAlbum(photos, { pages: 20, seed: 0 });
  const b = layoutAlbum(photos, { pages: 20, seed: 7 });
  assert.equal(b.length, 20);
  assert.deepEqual(
    b.flatMap((p) => p.photos.map((x) => x.uri)).sort(),
    a.flatMap((p) => p.photos.map((x) => x.uri)).sort(),
  );
  assert.notDeepEqual(
    a.map((p) => p.photos.length),
    b.map((p) => p.photos.length),
  );
  // deterministic
  assert.deepEqual(layoutAlbum(photos, { pages: 20, seed: 7 }), b);
});

test("templates: two landscapes stack, two portraits sit side by side, 3-up puts the landscape on top", () => {
  const ll = templateFor([ph(4, 3), ph(16, 9)]).template;
  assert.equal(ll.rows.length, 2);
  assert.equal(ll.cols.length, 1);
  const pp = templateFor([ph(3, 4), ph(9, 16)]).template;
  assert.equal(pp.cols.length, 2);
  assert.equal(pp.rows.length, 1);
  const three = templateFor([ph(3, 4, 1), ph(16, 9, 2), ph(1, 1, 3)]);
  assert.equal(three.order[0].uri, "p2");
  assert.deepEqual(three.template.areas[0], { rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 3 });
});

test("rects tile the page without overlap and inside the padding", () => {
  const photos = mixed(4);
  const { template } = templateFor(photos);
  const rects = resolveRects(template, 300, 6, 10);
  assert.equal(rects.length, 4);
  for (const r of rects) {
    assert.ok(r.x >= 10 && r.y >= 10 && r.x + r.w <= 290.001 && r.y + r.h <= 290.001);
  }
  for (let i = 0; i < rects.length; i++)
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i];
      const b = rects[j];
      const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
      assert.equal(overlap, false);
    }
});
