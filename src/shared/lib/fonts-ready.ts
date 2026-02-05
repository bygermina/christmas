const FONTS_READY_TIMEOUT_MS = 450;

export const whenFontsReady = (): Promise<void> =>
  Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => {
      setTimeout(resolve, FONTS_READY_TIMEOUT_MS);
    }),
  ]);
