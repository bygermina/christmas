const FONTS_READY_TIMEOUT_MS = 450;

export const whenFontsReady = (): Promise<void> => {
  const fontsApi = typeof document !== 'undefined' ? (document as Document & { fonts?: { ready: Promise<void> } }).fonts : undefined;

  if (!fontsApi?.ready) {
    return Promise.resolve();
  }

  return Promise.race([
    fontsApi.ready,
    new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, FONTS_READY_TIMEOUT_MS);
    }),
  ]);
};
