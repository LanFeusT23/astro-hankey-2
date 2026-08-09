import type { ImageRepository } from "./imageRepository";
import { StubImageRepository } from "./stubImageRepository";
import { FirebaseImageRepository } from "./firebaseImageRepository";
import { AwsImageRepository } from "./awsImageRepository";

type FirebaseRepositoryConfig = {
    appEnv: string;
    firebase: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
    };
};

export function getImageRepository(
    repoType?: string,
    firebaseConfig?: FirebaseRepositoryConfig,
): ImageRepository {
    const resolvedRepoType =
        repoType ||
        (typeof useRuntimeConfig !== "undefined"
            ? useRuntimeConfig().public.imageRepository
            : process.env.NUXT_IMAGE_REPOSITORY) ||
        "stub";

    switch (resolvedRepoType) {
        case "firebase":
            if (firebaseConfig) {
                return new FirebaseImageRepository(firebaseConfig.appEnv, firebaseConfig.firebase);
            } else if (typeof useRuntimeConfig !== "undefined") {
                const config = useRuntimeConfig();
                return new FirebaseImageRepository(config.public.appEnv, config.public.firebase);
            }
            return new StubImageRepository();
        case "aws":
            return new AwsImageRepository();
        case "stub":
        default:
            return new StubImageRepository();
    }
}

export type { ImageRepository };
