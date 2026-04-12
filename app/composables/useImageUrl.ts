export function buildStorageUrl(storageBucket: string, cloudLocation: string): string {
  return `https://storage.googleapis.com/${storageBucket}/${cloudLocation}`;
}

export function useImageUrl() {
  const config = useRuntimeConfig();
  const storageBucket = (config.public.firebase as Record<string, string>).storageBucket;

  function resolveUrl(cloudLocation: string | undefined): string | undefined {
    if (!cloudLocation) return undefined;
    if (cloudLocation.startsWith("https://") || cloudLocation.startsWith("http://"))
      return cloudLocation;
    if (!storageBucket) return undefined;
    return buildStorageUrl(storageBucket, cloudLocation);
  }

  return { resolveUrl };
}
