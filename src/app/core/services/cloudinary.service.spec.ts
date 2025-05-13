import { TestBed } from '@angular/core/testing';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  let servicePrivate: {
    generateImageUrl: (url: string) => string;
    generateSvgUrl: (url: string) => string;
  };

  const CLOUDINARY_BASE = 'https://res.cloudinary.com/djzn9f9kc/image/upload';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryService);
    servicePrivate = service as unknown as {
      generateImageUrl: (url: string) => string;
      generateSvgUrl: (url: string) => string;
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Public properties', () => {
    it('should have local assets', () => {
      expect(service.local.favicon).toBe('/assets/logo.svg');
      expect(service.local.tourVideo).toBe('/assets/tour-video.mp4');
    });

    it('should have image assets with optimization', () => {
      expect(service.images.background).toContain(`${CLOUDINARY_BASE}/q_auto,f_webp/`);
      expect(service.images.lydia).toContain(`${CLOUDINARY_BASE}/q_auto,f_webp/`);
    });

    it('should have SVG assets without optimization', () => {
      expect(service.svg.orangeLogo).toContain(CLOUDINARY_BASE);
      expect(service.svg.orangeLogo).not.toContain('q_auto');
    });
  });

  describe('Private methods', () => {
    it('generateImageUrl should add optimizations', () => {
      const testUrl = 'v123/test.webp';
      const result = servicePrivate.generateImageUrl(testUrl);
      expect(result).toBe(`${CLOUDINARY_BASE}/q_auto,f_webp/${testUrl}`);
    });

    it('generateSvgUrl should return direct URL', () => {
      const testUrl = 'v123/test.svg';
      const result = servicePrivate.generateSvgUrl(testUrl);
      expect(result).toBe(`${CLOUDINARY_BASE}/${testUrl}`);
    });
  });

  it('should not include width parameters in image URLs', () => {
    const testUrl = 'v123/test.webp';
    const result = servicePrivate.generateImageUrl(testUrl);
    expect(result).not.toContain('w_');
  });
});
