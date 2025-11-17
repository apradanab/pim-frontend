import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UploadFolder, UploadResponse } from '../../../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly cdnUrl = environment.cdnUrl;
  private readonly mediaApiKey = environment.mediaApiKey;

  private readonly allowedTypes = ['image/jpeg','image/jpg','image/png','image/webp','image/svg'];

  generateUploadUrl(
    type: UploadFolder,
    id: string,
    contentType: string
  ): Observable<UploadResponse> {
    if (!this.allowedTypes.includes(contentType)) {
      throw new Error('File type not allowed');
    }

    const headers = {
      'x-api-key': this.mediaApiKey,
    };

    return this.http.put<UploadResponse>( `${this.apiUrl}/media/${type}/${id}`, {}, { params: { contentType }, headers: headers });
  }

  async uploadFile(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.status}`);
    }
  }

  getImageUrl(key: string, folder?: UploadFolder): string {
    if (folder) {
      return `${this.cdnUrl}/${folder}/${key}`
    }
    return `${this.cdnUrl}/${key}`
  }
}
