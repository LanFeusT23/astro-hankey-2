import IconsResolver from "unplugin-icons/resolver";
import ViteComponents from "unplugin-vue-components/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    modules: ["unplugin-icons/nuxt"],
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        optimizeDeps: {
            include: [
                "@vue/devtools-core",
                "@vue/devtools-kit",
                "firebase/app",
                "firebase/auth",
                "firebase/firestore",
                "firebase/storage",
                "zod",
            ],
        },
        plugins: [
            tailwindcss(),
            ViteComponents({
                resolvers: [
                    IconsResolver({
                        prefix: "",
                        strict: true,
                    }),
                ],
                dts: true,
            }),
        ],
    },
    app: {
        baseURL: process.env.NUXT_APP_BASE_URL || "/",
        pageTransition: {
            name: "page-fade",
            mode: "out-in",
        },
    },
    runtimeConfig: {
        public: {
            imageRepository: process.env.NUXT_IMAGE_REPOSITORY || "stub",
            appEnv: process.env.NUXT_PUBLIC_APP_ENV || "production",
            adminUids: process.env.NUXT_PUBLIC_ADMIN_UIDS || "",
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
