// Polyfills for jsdom + Chakra UI / @zag-js focus-visible
// Fixes "Cannot set property focus of #<HTMLElement> which has only a getter"
// by making the focus property configurable/writable in the test environment.
;(function patchFocus() {
  try {
    const proto = (globalThis as any).HTMLElement?.prototype;
    if (proto) {
      const desc = Object.getOwnPropertyDescriptor(proto, 'focus');
      // Try a few strategies: prefer defineProperty, but fall back to simple assignment.
      try {
        if (!desc || !desc.writable) {
          Object.defineProperty(proto, 'focus', {
            configurable: true,
            writable: true,
            value: function focus(this: HTMLElement) {
              // no-op focus implementation for jsdom tests
              return undefined;
            },
          });
        }
      } catch (e) {
        // defineProperty can fail if the property is not configurable; try assignment.
        try {
          (proto as any).focus = function focus(this: HTMLElement) {
            return undefined;
          };
        } catch (e2) {
          // ignore - best-effort
        }
      }
    }
  } catch (err) {
    // swallow - best effort patch for test environment
    // console.warn('vitest.setup: could not patch HTMLElement.focus', err)
  }
})();

// Additionally, try to stub the @zag-js/focus-visible runtime so that Chakra's
// checkbox code doesn't attempt to register global focus handlers in jsdom.
// This is a defensive no-op; if the module can't be imported, we ignore it.
(function stubZagFocusVisible() {
  try {
    // Dynamic import avoids bundler/time-of-import ordering problems.
    // We don't await this promise; we only attempt to replace the exported helper
    // with a no-op if the module is present.
    import('@zag-js/focus-visible')
      .then((mod: any) => {
        if (mod && typeof mod.setupGlobalFocusEvents === 'function') {
          mod.setupGlobalFocusEvents = () => {};
        }
        if (mod && typeof mod.trackFocusVisible === 'function') {
          mod.trackFocusVisible = () => {
            return {
              connect: () => {},
              disconnect: () => {},
            } as any;
          };
        }
      })
      .catch(() => {
        // ignore
      });
  } catch (e) {
    // ignore
  }
})();
