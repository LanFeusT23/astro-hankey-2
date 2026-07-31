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

let _repository: ImageRepository | null = null;

export function getImageRepository(
    repoType?: string,
    firebaseConfig?: FirebaseRepositoryConfig,
): ImageRepository {
    if (_repository) {
        return _repository;
    }

    const resolvedRepoType =
        repoType ||
        (typeof useRuntimeConfig !== "undefined"
            ? useRuntimeConfig().public.imageRepository
            : process.env.NUXT_IMAGE_REPOSITORY) || "stub";

    switch (resolvedRepoType) {
        case "firebase":
            if (firebaseConfig) {
                _repository = new FirebaseImageRepository(
                    firebaseConfig.appEnv,
                    firebaseConfig.firebase,
                );
            } else if (typeof useRuntimeConfig !== "undefined") {
                const config = useRuntimeConfig();
                _repository = new FirebaseImageRepository(config.public.appEnv, config.public.firebase);
            } else {
                _repository = new StubImageRepository();
            }
            break;
        case "aws":
            _repository = new AwsImageRepository();
            break;
        case "stub":
        default:
            _repository = new StubImageRepository();
            break;
    }

    return _repository;
}

export type { ImageRepository };
