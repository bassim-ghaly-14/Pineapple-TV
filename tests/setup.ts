// Mock localStorage for node test environments (jsdom already provides window).
if (typeof window === "undefined") {
  const store = new Map<string, string>();

  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear(),
      },
    },
    writable: true,
    configurable: true,
  });
}
