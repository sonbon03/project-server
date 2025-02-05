import { FileValidator } from '@nestjs/common';

export interface CustomUploadSizeValidatorOptions {
    size: number;
}

export class CustomUploadFileSizeValidator extends FileValidator {
    private _allowedSize: number;

    constructor(protected readonly validationOptions: CustomUploadSizeValidatorOptions) {
        super(validationOptions);
        this._allowedSize = this.validationOptions.size;
    }

    public isValid(file?: any): boolean {
        const files = Object.values(file);
        for (const image of files) {
            if (image[0].size > this._allowedSize) {
                return false;
            }
        }
        return true;
    }

    public buildErrorMessage(): string {
        return `Upload not allowed. Upload only files size must lower: ${this.validationOptions.size / 1024 / 1024}Mb`;
    }
}
