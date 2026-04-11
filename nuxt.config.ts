import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || "/",
  },
  runtimeConfig: {
    public: {
      imageRepository: process.env.NUXT_IMAGE_REPOSITORY || "stub",
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || "",
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || "",
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || "",
      },
    },
  },
  compatibilityDate: "2024-11-01",
});
