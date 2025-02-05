import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_SECRET'),
    });
  }

  async uploadImage(fileBuffer: Buffer): Promise<string | UploadApiResponse> {
    if (!fileBuffer) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      return await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'server-management',
              resource_type: 'image',
            },
            (error: UploadApiErrorResponse, result: UploadApiResponse) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            },
          )
          .end(fileBuffer);
      });
    } catch (error) {
      throw new BadRequestException('Upload failed: ' + error.message);
    }
  }
}
