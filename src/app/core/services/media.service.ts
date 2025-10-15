import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface UploadResponse {
  uploadUrl: string;
  viewUrl: string;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly cdnUrl = environment.cdnUrl;

  private readonly allowedTypes = ['image/jpeg','image/jpg','image/png','image/webp'];

  generateUploadUrl(
    type: 'therapy' | 'advice' | 'user',
    id: string,
    contentType: string
  ): Observable<UploadResponse> {
    if (!this.allowedTypes.includes(contentType)) {
      throw new Error('File type not allowed');
    }

    return this.http.put<UploadResponse>( `${this.apiUrl}/media/${type}/${id}`, {}, { params: { contentType } })
    ;
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

  getImageUrl(key: string): string {
    return `${this.cdnUrl}/${key}`
  }
}
