const FONTS_READY_TIMEOUT_MS = 450;

export const whenFontsReady = (): Promise<void> => {
  const fontsApi = typeof document !== 'undefined' ? document.fonts : undefined;

  if (!fontsApi?.ready) {
    return Promise.resolve();
  }

  const readyPromise: Promise<void> = fontsApi.ready.then(() => undefined);

  return Promise.race([
    readyPromise,
    new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, FONTS_READY_TIMEOUT_MS);
    }),
  ]);
};
