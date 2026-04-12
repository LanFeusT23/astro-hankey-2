import type { ImageRepository } from "./imageRepository";
import type { AstroImage } from "~/types/image";

// TODO: Implement AWS S3 + DynamoDB backend
// Required packages: @aws-sdk/client-s3, @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb
// Required env vars:
//   AWS_REGION
//   AWS_ACCESS_KEY_ID
//   AWS_SECRET_ACCESS_KEY
//   AWS_S3_BUCKET
//   AWS_DYNAMODB_TABLE
//
// Implementation outline:
//   - Use DynamoDB table for image metadata (PK: id)
//   - Use S3 bucket for image files
//   - Thumbnails stored at thumbnails/{id}.jpg
//   - Full-res stored at full/{id}.jpg
//   - Pre-signed URLs for uploads from the client

export class AwsImageRepository implements ImageRepository {
  async getAll(): Promise<AstroImage[]> {
    // TODO: const result = await dynamodb.send(new ScanCommand({ TableName: process.env.AWS_DYNAMODB_TABLE }))
    // TODO: return (result.Items ?? []) as AstroImage[]
    throw new Error("AwsImageRepository not yet implemented");
  }

  async getById(id: string): Promise<AstroImage | null> {
    // TODO: const result = await dynamodb.send(new GetCommand({ TableName: process.env.AWS_DYNAMODB_TABLE, Key: { id } }))
    // TODO: return (result.Item as AstroImage) ?? null
    throw new Error("AwsImageRepository not yet implemented");
  }

  async create(image: Omit<AstroImage, "id">): Promise<AstroImage> {
    // TODO: const id = crypto.randomUUID()
    // TODO: await dynamodb.send(new PutCommand({ TableName: process.env.AWS_DYNAMODB_TABLE, Item: { id, ...image } }))
    // TODO: return { id, ...image }
    throw new Error("AwsImageRepository not yet implemented");
  }

  async update(id: string, updates: Partial<Omit<AstroImage, "id">>): Promise<AstroImage> {
    // TODO: Build UpdateExpression from updates keys
    // TODO: await dynamodb.send(new UpdateCommand({ ... }))
    throw new Error("AwsImageRepository not yet implemented");
  }

  async delete(id: string): Promise<void> {
    // TODO: await dynamodb.send(new DeleteCommand({ TableName: process.env.AWS_DYNAMODB_TABLE, Key: { id } }))
    throw new Error("AwsImageRepository not yet implemented");
  }

  async uploadImage(
    file: File,
    imageId?: string,
  ): Promise<{ cloudLocation: string; thumbnailUrl?: string }> {
    // TODO: Generate pre-signed S3 PUT URL
    // TODO: Upload file to S3
    // TODO: Return public CDN URLs
    throw new Error("AwsImageRepository not yet implemented");
  }
}
