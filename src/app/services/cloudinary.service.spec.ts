import { TestBed } from '@angular/core/testing';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  const CLOUDINARY_BASE = 'https://res.cloudinary.com/djzn9f9kc/image/upload';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('image()', () => {
    it('should return URL with default optimizations', () => {
      const url = 'v123/path/image.webp';
      const result = service.image(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/q_auto,f_webp/${url}`);
    });

    it('should handle empty string URL without errors', () => {
      const result = service.image('');
      expect(result).toBe(`${CLOUDINARY_BASE}/q_auto,f_webp/`);
    });

    it('should handle special characters in URL', () => {
      const url = 'v123/path/íma ge@special.webp';
      const result = service.image(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/q_auto,f_webp/${url}`);
    });
  });

  describe('svg()', () => {
    it('should return direct SVG URL without transformations', () => {
      const url = 'v123/path/icon.svg';
      const result = service.svg(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/${url}`);
    });

    it('should preserve existing query parameters', () => {
      const url = 'v123/path/icon.svg?param=value';
      const result = service.svg(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/${url}`);
    });

    it('should handle SVG URLs with special characters', () => {
      const url = 'v123/path/ícon@special.svg';
      const result = service.svg(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/${url}`);
    });
  });

  it('should not include width parameter in image URLs', () => {
    const url = 'v123/path/image.webp';
    const result = service.image(url);
    expect(result).not.toContain('w_');
  });
});
