/// <reference types="vite/client" />

interface ImportMetaEnv {
  /* todo: make some stronger types */
  readonly VITE_LOG_LEVEL: string,
  readonly VITE_SHOW_PINS: string,
  readonly VITE_SHOW_SHAPE_CANVAS: string,
  readonly VITE_SHOW_TEXT_CANVAS: string,

  readonly VITE_BACKEND_DOMAIN: string,
  readonly VITE_BACKEND_PORT: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
