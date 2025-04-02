import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  readonly baseUrl = 'https://res.cloudinary.com/djzn9f9kc/image/upload';

  image(url: string): string {
    return `${this.baseUrl}/q_auto,f_webp/${url}`;
  }

  svg(url: string): string {
    return `${this.baseUrl}/${url}`;
  }
}
