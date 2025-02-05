import {
  Controller,
  ParseFilePipe,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomUploadFileSizeValidator } from 'src/pipe/CustomUploadFileSizeValidator';
import { CustomUploadFileTypeValidator } from 'src/pipe/CustomUploadTypeValidation';
import { ImageService } from './image.service';

const VALID_UPLOADS_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/jpg',
];

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiTags('Images')
  @ApiOperation({
    description: 'Upload image',
    summary: 'Upload image',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: 'string',
  })
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async updateUserProfile(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new CustomUploadFileTypeValidator({
            fileType: VALID_UPLOADS_MIME_TYPES,
          }),
          new CustomUploadFileSizeValidator({ size: 1024 * 1024 * 5 }),
        ],
      }),
    )
    file: {
      image?: any;
    },
  ) {
    return this.imageService.uploadImage(
      file.image ? file.image[0]?.buffer : null,
    );
  }
}
