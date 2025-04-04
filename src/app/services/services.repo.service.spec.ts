import { TestBed } from '@angular/core/testing';
import { ServicesRepoService } from './services.repo.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Service } from '../models/service.model';

describe('ServicesRepoService', () => {
  let service: ServicesRepoService;
  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Terapia 1',
      description: 'Descripción 1',
      content: 'Contenido 1',
      image: 'image1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ServicesRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch services', () => {
    const httpTestingController = TestBed.inject(HttpTestingController);
    service.getServices().subscribe(services => {
      expect(services).toEqual(mockServices);
    });

    const req = httpTestingController.expectOne(service['url']);
    expect(req.request.method).toBe('GET');
    req.flush(mockServices);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });
});
