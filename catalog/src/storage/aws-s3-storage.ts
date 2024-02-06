import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { type Catalog, type IStorage } from './interface'

export class AwsS3Storage implements IStorage {
  private readonly client: S3Client
  constructor(private readonly bucketName: string) {
    this.client = this._connection()
  }

  _connection(): S3Client {
    return new S3Client({
      region: String(process.env.AWS_REGION),
      endpoint: String(process.env.AWS_ENDPOINT),
      forcePathStyle: true,
      credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
      },
    })
  }

  async getCatalog(fileName: string): Promise<Catalog> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ResponseContentType: 'application/json',
    })
    const response = await this.client.send(command)
    const bodyString = await response.Body?.transformToString('utf-8')
    if (bodyString) {
      const data: Catalog = JSON.parse(bodyString as string)
      return data
    }
    throw new Error(`I didn't find this ${fileName} file on S3`)
  }
}
