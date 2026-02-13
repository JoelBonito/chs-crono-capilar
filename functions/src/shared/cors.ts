// Allowed origins for CORS
const PRODUCTION_ORIGINS = [
  "https://cronocapilar.web.app",
  "https://cronocapilar.firebaseapp.com",
];

const DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:5005",
];

function isEmulatorMode(): boolean {
  return (
    process.env.FUNCTIONS_EMULATOR === "true" ||
    process.env.FIREBASE_EMULATOR_HUB !== undefined
  );
}

export const ALLOWED_ORIGINS: string[] = isEmulatorMode()
  ? [...PRODUCTION_ORIGINS, ...DEV_ORIGINS]
  : PRODUCTION_ORIGINS;
