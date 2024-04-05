import fs from 'fs'
import stream from 'stream'
import S3 from 'aws-sdk/clients/s3.js'
import { FileService } from 'medusa-interfaces'
import { randomUUID } from 'crypto'

interface FileData {
  ext: string
  name: string
  fileKey: string
}

class CloudflareR2StorageService extends FileService {
  bucket: string
  endpoint: string
  account_id: string
  access_key: string
  secret_key: string
  public_url: string

  constructor () {
    super()

    this.bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? ''
    this.account_id = process.env.CLOUDFLARE_R2_ACCOUNT_ID ?? ''
    this.access_key = process.env.CLOUDFLARE_R2_ACCESS_KEY ?? ''
    this.secret_key = process.env.CLOUDFLARE_R2_SECRET_KEY ?? ''
    this.public_url = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? ''
    this.endpoint = `https://${this.account_id}.r2.cloudflarestorage.com`
  }

  storageClient (): S3 {
    const client = new S3({
      region: 'auto',
      signatureVersion: 'v4',
      endpoint: this.endpoint,
      accessKeyId: this.access_key,
      secretAccessKey: this.secret_key
    })

    return client
  }

  async uploadFile (file: Express.Multer.File): Promise<Record<string, string>> {
    const client = this.storageClient()
    const fileExt = file.originalname.split('.').pop()

    const params = {
      Bucket: this.bucket,
      Key: `${randomUUID()}.${fileExt}`,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype
    }

    try {
      const data = await client.upload(params).promise()

      return {
        url: `${this.public_url}/${data.Key}`,
        key: data.Key
      }
    } catch (err) {
      console.error(err)
      throw new Error('An error occurred while uploading the file.')
    }
  }

  async upload (file: Express.Multer.File): Promise<Record<string, string>> {
    return await this.uploadFile(file)
  }

  async uploadProtected (file: Express.Multer.File): Promise<Record<string, string>> {
    return await this.uploadFile(file)
  }

  async delete (file: string): Promise<void> {
    const client = this.storageClient()

    const params = {
      Bucket: this.bucket,
      Key: `${file}`
    }

    try {
      await client.deleteObject(params).promise()
    } catch (err) {
      console.error(err)
      throw new Error('An error occurred while deleting the file.')
    }
  }

  async getDownloadStream (fileData: FileData): Promise<stream.Readable> {
    const client = this.storageClient()

    const params = {
      Bucket: this.bucket,
      Key: fileData.fileKey
    }

    try {
      return client.getObject(params).createReadStream()
    } catch (err) {
      console.error(err)
      throw new Error('An error occurred while downloading the file.')
    }
  }

  async getPresignedDownloadUrl (fileData: FileData): Promise<string> {
    const client = this.storageClient()

    const params = {
      Bucket: this.bucket,
      Key: fileData.fileKey,
      Expires: 60 * 60 // 1 hour
    }

    try {
      return await client.getSignedUrlPromise('getObject', params)
    } catch (err) {
      console.error(err)
      throw new Error('An error occurred while downloading the file.')
    }
  }

  async getUploadStreamDescriptor (fileData: FileData): Promise<Record<string, any>> {
    const client = this.storageClient()
    const pass = new stream.PassThrough()
    const fileKey = `${fileData.name}.${fileData.ext}`

    const params = {
      Body: pass,
      Key: fileKey,
      Bucket: this.bucket
    }

    return {
      fileKey,
      writeStream: pass,
      promise: client.upload(params).promise(),
      url: `${this.endpoint}/${this.bucket}/${fileKey}`
    }
  }
}

export default CloudflareR2StorageService
