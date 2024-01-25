/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOST_IP: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
