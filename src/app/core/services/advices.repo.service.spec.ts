import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdvicesRepoService } from './advices.repo.service';
import { Advice } from '../../models/advice.model';

describe('AdvicesRepoService', () => {
  let service: AdvicesRepoService;
  let httpTestingController: HttpTestingController;

  const mockAdvice: Advice = {
    id: '1',
    title: 'Test Advice',
    description: 'Test Description',
    content: 'Test Content',
    image: 'http://test.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceId: '1'
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

  it('should get advices by service id', () => {
    const mockAdvices: Advice[] = [mockAdvice];

    service.getAdvicesByServiceId('1').subscribe(advices => {
      expect(advices).toEqual(mockAdvices);
    });

    const req = httpTestingController.expectOne(`${service['url']}/service/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdvices);
  });

  it('should create a new advice', () => {
    const newAdvice: Advice = { ...mockAdvice, id: '2' };

    service.createAdvice(newAdvice).subscribe(advice => {
      expect(advice).toEqual(newAdvice);
    });

    const req = httpTestingController.expectOne(service['url']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAdvice);
    req.flush(newAdvice);
  });
});
