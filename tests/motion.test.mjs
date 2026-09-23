import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, shortestDelta, frontIndex } from '../src/lib/motion.ts';

test('shortest rotation crosses the zero seam without a full revolution', () => {
  assert.equal(shortestDelta(350, 10), 20);
  assert.equal(shortestDelta(10, 350), -20);
  assert.equal(shortestDelta(1080, -60), -60);
  assert.equal(shortestDelta(-1080, 60), 60);
  for (let from = -1080; from <= 1080; from += 17) {
    for (let index = 0; index < 6; index++) {
      const delta = shortestDelta(from, -index * 60);
      assert(Math.abs(delta) <= 180);
      assert.equal(frontIndex(from + delta, 6), index);
    }
  }
});

test('gallery selection wraps correctly across negative and positive rotations', () => {
  assert.equal(frontIndex(0, 6), 0);
  assert.equal(frontIndex(-60, 6), 1);
  assert.equal(frontIndex(60, 6), 5);
  assert.equal(frontIndex(-360, 6), 0);
  assert.equal(frontIndex(360, 6), 0);
  assert.equal(frontIndex(-720, 1), 0);
  assert.equal(frontIndex(0, 0), 0);
});

test('seek target bounds survive overscroll and extreme cursor positions', () => {
  assert.equal(clamp(-0.1, 0, 1), 0);
  assert.equal(clamp(1.1, 0, 1), 1);
  assert.equal(clamp(0.65, 0, 1), 0.65);
});
