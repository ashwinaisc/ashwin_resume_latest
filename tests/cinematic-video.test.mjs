import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the real component effect with a deterministic animation clock and
// a media element that models asynchronous seeking. No browser is automated.
function setup({ prefersReducedMotion = false, coarsePointer = false } = {}) {
  const effects = [], frames = new Map(), windowListeners = new Map(), videoListeners = new Map();
  let frameId = 0, playhead = 0, rejectNextSeek = false;
  const writes = [];
  const video = {
    duration: NaN, readyState: 0, seeking: false, paused: true,
    get currentTime() { return playhead; },
    set currentTime(value) {
      if (rejectNextSeek) { rejectNextSeek = false; throw new Error('Decoder temporarily unavailable'); }
      assert.equal(this.seeking, false, 'An in-flight seek must not be interrupted');
      playhead = value; writes.push(value); this.seeking = true;
    },
    pause() { this.paused = true; },
    addEventListener(name, fn) { videoListeners.set(name, fn); },
    removeEventListener(name) { videoListeners.delete(name); },
  };
  const windowMock = {
    innerWidth: 1000, innerHeight: 800, scrollY: 0,
    addEventListener(name, fn) { windowListeners.set(name, fn); },
    removeEventListener(name) { windowListeners.delete(name); },
  };
  const media = { matches: prefersReducedMotion, addEventListener() {}, removeEventListener() {} };
  const touchMedia = { matches: coarsePointer, addEventListener() {}, removeEventListener() {} };
  const jsx = (tag, props) => {
    if (props?.ref) props.ref.current = tag === 'video' ? video : { style: {} };
    return { tag, props };
  };
  const module = { exports: {} };
  const source = readFileSync(new URL('../src/components/CinematicVideo.tsx', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020,
  } }).outputText;
  const context = {
    module, exports: module.exports,
    require(name) {
      if (name === 'react') return { useRef: value => ({ current: value }), useState: value => [value, () => {}], useEffect: effect => effects.push(effect) };
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'fragment' };
      if (name === '@/lib/motion') return { clamp: (value, min, max) => Math.min(max, Math.max(min, value)) };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    window: windowMock, document: { hidden: false, documentElement: { scrollHeight: 4800 }, getElementById: () => null },
    matchMedia: query => query.includes('pointer: coarse') ? touchMedia : media,
    requestAnimationFrame(fn) { const id = ++frameId; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver: class { observe() {} disconnect() {} },
  };
  vm.runInNewContext(compiled, context);
  const tree = module.exports.default();
  const cleanups = effects.map(effect => effect());
  return {
    video, writes, window: windowMock, windowListeners, videoListeners, frames,
    frame() { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()); },
    loaded() { video.duration = 10; video.readyState = 1; videoListeners.get('loadedmetadata')(); video.seeking = false; },
    move(x, type = 'pointermove', pointerType = 'mouse', y = 400) { windowListeners.get(type)({ clientX: x, clientY: y, ...(type === 'pointermove' ? { pointerType } : {}) }); },
    scroll(y) { windowMock.scrollY = y; windowListeners.get('scroll')(); },
    decode() { video.seeking = false; },
    reject() { rejectNextSeek = true; },
    toggle() { tree.props.children.at(-1).props.onClick(); },
    dispose() { cleanups.forEach(cleanup => cleanup()); },
  };
}

test('cursor uses the RAF LERP after metadata, even at readyState 1', () => {
  const engine = setup();
  engine.move(900); engine.frame();
  assert.equal(engine.writes.length, 0);
  engine.loaded();
  assert.equal(engine.video.paused, true);
  assert.equal(engine.video.currentTime, 0);
  engine.frame();
  assert(Math.abs(engine.video.currentTime - 0.8964) < 0.000001);
  const first = engine.video.currentTime;
  engine.decode(); engine.frame();
  const second = engine.video.currentTime;
  assert(second > first && second < 8.964);
  assert(Math.abs((second - first) - (8.964 - first) * 0.10) < 0.000001);
  engine.dispose();
});

test('slow decoding is not starved by repeated seek requests', () => {
  const engine = setup(); engine.loaded(); engine.move(1000); engine.frame();
  const count = engine.writes.length;
  for (let i = 0; i < 15; i++) engine.frame();
  assert.equal(engine.writes.length, count, 'No new seek until the pending frame decodes');
  engine.decode(); engine.frame();
  assert.equal(engine.writes.length, count + 1);
  assert(engine.video.currentTime > 7, 'LERP continues advancing while decoding');
  engine.dispose();
});

test('mousemove fallback, reverse seeking and scroll each cover the clip', () => {
  const engine = setup(); engine.loaded(); engine.move(1000, 'mousemove');
  for (let i = 0; i < 120; i++) { engine.decode(); engine.frame(); }
  assert(Math.abs(engine.video.currentTime - 9.96) < 0.002);
  engine.move(0, 'mousemove');
  for (let i = 0; i < 120; i++) { engine.decode(); engine.frame(); }
  assert(engine.video.currentTime < 0.002);
  engine.scroll(4000);
  for (let i = 0; i < 120; i++) { engine.decode(); engine.frame(); }
  assert(Math.abs(engine.video.currentTime - 9.96) < 0.002);
  assert.equal(engine.video.paused, true);
  engine.dispose();
});

test('failed seeks recover and pause/resume keeps one RAF loop', () => {
  const engine = setup(); engine.loaded(); engine.move(700); engine.reject();
  assert.doesNotThrow(() => engine.frame());
  assert.equal(engine.video.currentTime, 0);
  engine.frame(); assert(engine.video.currentTime > 0);
  engine.decode(); engine.toggle();
  const stopped = engine.video.currentTime;
  for (let i = 0; i < 5; i++) engine.frame();
  assert.equal(engine.video.currentTime, stopped);
  engine.toggle(); engine.frame();
  assert(engine.video.currentTime > stopped);
  assert.equal(engine.frames.size, 1);
  engine.video.paused = false; engine.videoListeners.get('play')();
  assert.equal(engine.video.paused, true);
  engine.dispose();
  assert.equal(engine.frames.size, 0);
  assert.equal(engine.windowListeners.size, 0);
  assert.equal(engine.videoListeners.size, 0);
});

test('mobile vertical scroll scrubs the full clip within the opening scene', () => {
  const engine = setup({ coarsePointer: true }); engine.loaded();
  engine.move(1000, 'pointermove', 'touch', 400);
  engine.frame();
  assert.equal(engine.video.currentTime, 0, 'touch movement alone must not scrub');
  engine.scroll(1000);
  for (let i = 0; i < 120; i++) { engine.decode(); engine.frame(); }
  assert(Math.abs(engine.video.currentTime - 9.96) < 0.002);
  engine.dispose();
});

test('reduced-motion preference still allows scroll scrubbing without parallax', () => {
  const engine = setup({ prefersReducedMotion: true }); engine.loaded(); engine.scroll(4000);
  for (let i = 0; i < 120; i++) { engine.decode(); engine.frame(); }
  assert(Math.abs(engine.video.currentTime - 9.96) < 0.002);
  assert.equal(engine.video.paused, true);
  engine.dispose();
});
