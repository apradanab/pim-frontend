import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private baseUrl = 'https://res.cloudinary.com/djzn9f9kc/image/upload';

  getImage(url: string, width?: number): string {
    return `${this.baseUrl}/q_auto,f_webp${width ? `,w_${width}` : ''}/${url}`;
  }

  getSvg(url: string): string {
    return `${this.baseUrl}/${url}`;
  }
}
