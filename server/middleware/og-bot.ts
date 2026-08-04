const BOT_UA_PATTERN =
    /slackbot|twitterbot|facebookexternalhit|linkedinbot|whatsapp|telegrambot|discordbot|googlebot|bingbot|applebot/i;

const GALLERY_SLUG_PATTERN = /^\/gallery\/([^/?#]+)/;

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function buildStorageUrl(storageBucket: string, cloudLocation: string): string {
    return `https://storage.googleapis.com/${storageBucket}/${encodeURIComponent(cloudLocation)}`;
}

export default defineEventHandler(async (event) => {
    const ua = getRequestHeader(event, "user-agent") ?? "";
    if (!BOT_UA_PATTERN.test(ua)) {
        return;
    }

    const url = getRequestURL(event);
    const match = GALLERY_SLUG_PATTERN.exec(url.pathname);
    if (!match) {
        return;
    }

    const slug = match[1];
    const config = useRuntimeConfig(event);
    const firebase = config.public.firebase as {
        apiKey: string;
        projectId: string;
        storageBucket: string;
    };
    const appEnv: string = config.public.appEnv as string;

    const isStaging = appEnv === "staging";
    const collection = isStaging ? "testImages" : "images";

    let title = "Jonathan Hankey Astrophotography";
    let description =
        "Browse the astrophotography gallery featuring nebulae, galaxies, and star clusters.";
    let imageUrl: string | undefined;

    try {
        const { initializeApp, getApps, getApp } = await import("firebase/app");
        const app =
            getApps().length === 0
                ? initializeApp(firebase, "og-bot")
                : (getApps().find((a) => a.name === "og-bot") ?? getApp());

        const { getFirestore, doc, getDoc } = await import("firebase/firestore");
        const db = getFirestore(app);
        const snap = await getDoc(doc(db, collection, slug));

        if (snap.exists()) {
            const data = snap.data();
            if (data.title) title = `${data.title} — Jonathan Hankey Astrophotography`;
            if (data.subTitle) description = data.subTitle;
            if (data.thumbnail && firebase.storageBucket) {
                const thumb: string = data.thumbnail;
                imageUrl =
                    thumb.startsWith("http://") || thumb.startsWith("https://")
                        ? thumb
                        : buildStorageUrl(firebase.storageBucket, thumb);
            }
        }
    } catch {
        // Fall through to serve generic OG tags rather than failing
    }

    const origin = `${url.protocol}//${url.host}`;
    const pageUrl = `${origin}/gallery/${slug}`;
    const ogImage = imageUrl ?? `${origin}/favicon.ico`;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Jonathan Hankey Astrophotography">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(pageUrl)}">
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<meta http-equiv="refresh" content="0;url=${escapeHtml(pageUrl)}">
<link rel="canonical" href="${escapeHtml(pageUrl)}">
</head>
<body>
<a href="${escapeHtml(pageUrl)}">${escapeHtml(title)}</a>
</body>
</html>`;

    setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
    setResponseHeader(event, "Cache-Control", "public, max-age=300, s-maxage=300");
    return html;
});
