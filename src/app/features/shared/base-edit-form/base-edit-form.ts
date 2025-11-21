import { inject, signal } from "@angular/core";
import { MediaService } from "../../../core/services/utils/media.service";
import { FormGroup } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { EditableItem, ImageInfo, UploadFolder } from "../../../models/form.model";

export abstract class BaseEditForm<T extends EditableItem> {
  protected readonly mediaService = inject(MediaService);

  file = signal<File | null>(null);
  previewUrl = signal<string | undefined>(undefined);

  abstract getCurrentItem(): T;
  abstract getForm(): FormGroup;
  abstract getItemId(): string;
  abstract getUploadFolder(): UploadFolder
  abstract getCurrentImageKey(): string | undefined;

  abstract buildUpdatedItem(formValue: object, image: ImageInfo | undefined): T;

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      this.file.set(selectedFile);

      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }

  protected async handleImageUpload(): Promise<ImageInfo | undefined> {
    let imageKey: string | undefined = this.getCurrentImageKey();

    try {
      if (this.file()) {
        const fileToUpload = this.file()!;

        const uploadResponse = await lastValueFrom(
          this.mediaService.generateUploadUrl(
            this.getUploadFolder(),
            this.getItemId(),
            fileToUpload.type
          )
        );

        await this.mediaService.uploadFile(uploadResponse.uploadUrl, fileToUpload);
        imageKey = uploadResponse.key;
      }

      return imageKey ? {
        key: imageKey,
        url: this.mediaService.getImageUrl(imageKey, this.getUploadFolder())
      } : undefined;
    } catch (error) {
      console.error(`Error uploading image for ${this.getUploadFolder()}:`, error);
      throw error;
    }
  }

  async submitBase(): Promise<T | null> {
    const form = this.getForm();
    if (form.invalid) return null;

    try {
      const imageInfo = await this.handleImageUpload();
      const formValue = form.getRawValue() as object;

      const updatedItem = this.buildUpdatedItem(formValue, imageInfo);
      return updatedItem;
    } catch (error) {
      console.error('submitBase failed after image upload', error);
      throw error;
    }
  }
}
