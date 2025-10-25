import { TestBed } from '@angular/core/testing';
import { MediaService, UploadResponse } from './media.service';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('MediaService', () => {
  let service: MediaService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        MediaService
      ]
    });
    service = TestBed.inject(MediaService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error if contentType not allowed', () => {
    expect(() => service.generateUploadUrl('therapy', '123', 'test/plain'))
      .toThrowError('File type not allowed');
  });

  it('should call http.put if contentType allowed', (done) => {
    spyOn(http, 'put').and.returnValue(of({ uploadUrl: '', viewUrl: '', key: '' } as UploadResponse));
    service.generateUploadUrl('therapy', '123', 'image/jpeg').subscribe(res => {
      expect(res).toBeTruthy();
      done();
    });
  });

  it('should call fetch and not throw error when response.ok=true', async () => {
    const testResponse = { ok: true } as Response;
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(testResponse));
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    await expectAsync(service.uploadFile('http://test.url', file)).toBeResolved();
  });

  it('should throw error when fetch response.ok=false', async () => {
    const testResponse = { ok: false, status: 400 } as unknown as Response;
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(testResponse));
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    await expectAsync(service.uploadFile('http://test.url', file))
      .toBeRejectedWithError('File upload failed: 400');
  });

  it('should reaturn a valid image URL', () => {
    const key = 'test-image.webp';
    const url = service.getImageUrl(key);
    expect(url).toContain(key);
  });
});
