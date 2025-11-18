/// <reference types="vite/client" />

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.module.scss" {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
