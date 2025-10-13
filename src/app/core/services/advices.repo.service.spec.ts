import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdvicesRepoService } from './advices.repo.service';
import { Advice } from '../../models/advice.model';

describe('AdvicesRepoService', () => {
  let service: AdvicesRepoService;
  let httpTestingController: HttpTestingController;

  const mockAdvice: Advice = {
    adviceId: '1',
    therapyId: '1',
    title: 'Test Advice',
    description: 'Test Description',
    content: 'Test Content',
    image: {
      key: 'test-key',
      url: 'http://test.com'
    },
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdvicesRepoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AdvicesRepoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all advices', () => {
    const mockAdvices: Advice[] = [mockAdvice];

    service.getAllAdvices().subscribe(advices => {
      expect(advices).toEqual(mockAdvices);
    });

    const req = httpTestingController.expectOne(service['url']);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdvices);
  });

  it('should get advice by id', () => {
    service.getAdviceById('1').subscribe(advice => {
      expect(advice).toEqual(mockAdvice);
    });

    const req = httpTestingController.expectOne(`${service['url']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdvice);
  });

  it('should get advices by therapy id', () => {
    const mockAdvices: Advice[] = [mockAdvice];

    service.getAdvicesByTherapyId('1').subscribe(advices => {
      expect(advices).toEqual(mockAdvices);
    });

    const req = httpTestingController.expectOne(`${service['therapiesUrl']}/1/advices`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdvices);
  });

  it('should create a new advice', () => {
    const newAdvice: Advice = { ...mockAdvice, adviceId: '2' };

    service.createAdvice(newAdvice).subscribe(advice => {
      expect(advice).toEqual(newAdvice);
    });

    const req = httpTestingController.expectOne(`${service['therapiesUrl']}/1/advices`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAdvice);
    req.flush(newAdvice);
  });
});
