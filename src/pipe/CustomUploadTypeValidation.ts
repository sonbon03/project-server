import { FileValidator } from '@nestjs/common';

export interface CustomUploadTypeValidatorOptions {
    fileType: string[];
}

export class CustomUploadFileTypeValidator extends FileValidator {
    private _allowedMimeTypes: string[];

    constructor(protected readonly validationOptions: CustomUploadTypeValidatorOptions) {
        super(validationOptions);
        this._allowedMimeTypes = this.validationOptions.fileType;
    }

    public isValid(file?: any): boolean {
        const files = Object.values(file);
        for (const image of files) {
            if (!this._allowedMimeTypes.includes(image[0].mimetype)) {
                return false;
            }
        }
        return true;
    }

    public buildErrorMessage(): string {
        return `Upload not allowed. Upload only files of type: ${this._allowedMimeTypes.join(', ')}`;
    }
}
