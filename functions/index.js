// Replacement for the firebase/storage-resize-images extension (shut down March 31, 2027).
// Mirrors the two former extension instances:
//   storage-resize-images       INCLUDE_PATH_LIST=/gallery
//   storage-resize-images-hnn7  INCLUDE_PATH_LIST=/testGallery
// with IMG_SIZES=500x500, RESIZED_IMAGES_PATH=thumbnails, DELETE_ORIGINAL_FILE=false,
// IMAGE_TYPE=false (keep original format), IS_ANIMATED=true, REGENERATE_TOKEN=true.
//
// gallery/foo.jpg -> gallery/thumbnails/foo_500x500.jpg

import { randomUUID } from "node:crypto";
import path from "node:path";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import sharp from "sharp";

initializeApp();

const INCLUDE_PATHS = ["gallery", "testGallery"];
const RESIZED_IMAGES_DIR = "thumbnails";
const WIDTH = 500;
const HEIGHT = 500;
const SIZE_SUFFIX = `_${WIDTH}x${HEIGHT}`;

// Formats sharp can write back in the same format as the source.
const SUPPORTED_FORMATS = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
    "image/tiff": "tiff",
    "image/gif": "gif",
    "image/avif": "avif",
};

function shouldResize(object) {
    const { name, contentType, metadata } = object;
    if (!name || !contentType) {
        return false;
    }
    if (!SUPPORTED_FORMATS[contentType]) {
        logger.info(`Skipping ${name}: unsupported content type ${contentType}`);
        return false;
    }
    if (metadata?.resizedImage === "true") {
        return false;
    }
    const dir = path.posix.dirname(name);
    // Only direct children of an included folder, never its thumbnails folder.
    return INCLUDE_PATHS.includes(dir);
}

export const generateThumbnail = onObjectFinalized(
    {
        region: "us-central1",
        memory: "1GiB",
        timeoutSeconds: 120,
    },
    async (event) => {
        const object = event.data;
        if (!shouldResize(object)) {
            return;
        }

        const { name, bucket: bucketName, contentType, cacheControl } = object;
        const dir = path.posix.dirname(name);
        const ext = path.posix.extname(name);
        const base = path.posix.basename(name, ext);
        const thumbnailPath = `${dir}/${RESIZED_IMAGES_DIR}/${base}${SIZE_SUFFIX}${ext}`;

        const bucket = getStorage().bucket(bucketName);
        const [original] = await bucket.file(name).download();

        const resized = await sharp(original, { failOn: "none", animated: true })
            .rotate()
            .resize(WIDTH, HEIGHT, { fit: "inside", withoutEnlargement: true })
            .toFormat(SUPPORTED_FORMATS[contentType])
            .toBuffer();

        await bucket.file(thumbnailPath).save(resized, {
            resumable: false,
            contentType,
            metadata: {
                ...(cacheControl ? { cacheControl } : {}),
                metadata: {
                    resizedImage: "true",
                    firebaseStorageDownloadTokens: randomUUID(),
                },
            },
        });

        logger.info(`Created thumbnail ${thumbnailPath}`);
    },
);
