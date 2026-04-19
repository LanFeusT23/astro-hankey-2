import type { ImageRepository } from "./imageRepository";
import { StubImageRepository } from "./stubImageRepository";
import { FirebaseImageRepository } from "./firebaseImageRepository";
import { AwsImageRepository } from "./awsImageRepository";

let _repository: ImageRepository | null = null;

export function getImageRepository(): ImageRepository {
    if (_repository) return _repository;

    const repoType =
        (typeof useRuntimeConfig !== "undefined"
            ? useRuntimeConfig().public.imageRepository
            : process.env.NUXT_IMAGE_REPOSITORY) || "stub";

    switch (repoType) {
        case "firebase":
            _repository = new FirebaseImageRepository();
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
