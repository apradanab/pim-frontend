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

  describe('getImage()', () => {
    it('should return URL with default optimizations when no width provided', () => {
      const url = 'v123/path/image.webp';
      const result = service.getImage(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/q_auto,f_webp/${url}`);
    });

    it('should include width parameter in URL when width is provided', () => {
      const url = 'v123/path/image.webp';
      const width = 800;
      const result = service.getImage(url, width);
      expect(result).toBe(`${CLOUDINARY_BASE}/q_auto,f_webp,w_${width}/${url}`);
    });

    it('should handle empty string URL without errors', () => {
      const result = service.getImage('');
      expect(result).toContain(CLOUDINARY_BASE);
    });
  });

  describe('getSvg()', () => {
    it('should return direct SVG URL without any transformations', () => {
      const url = 'v123/path/icon.svg';
      const result = service.getSvg(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/${url}`);
    });

    it('should preserve existing query parameters in SVG URLs', () => {
      const url = 'v123/path/icon.svg?param=value';
      const result = service.getSvg(url);
      expect(result).toBe(`${CLOUDINARY_BASE}/${url}`);
    });
  });
});
