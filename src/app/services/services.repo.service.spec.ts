import { TestBed } from '@angular/core/testing';
import { ServicesRepoService } from './services.repo.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Service } from '../models/service.model';

describe('ServicesRepoService', () => {
  let service: ServicesRepoService;
  let httpTestingController: HttpTestingController;

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

  const newService: Service = {
    id: '2',
    title: 'Nueva Terapia',
    description: 'Nueva Descripción',
    content: 'Nuevo Contenido',
    image: 'new-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ServicesRepoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch services', () => {
    service.getServices().subscribe(services => {
      expect(services).toEqual(mockServices);
    });

    const req = httpTestingController.expectOne(service['url']);
    expect(req.request.method).toBe('GET');
    req.flush(mockServices);
  });

  it('should fetch service by id', () => {
    const serviceId = '1';
    service.getServiceById(serviceId).subscribe(service => {
      expect(service).toEqual(mockServices[0]);
    });

    const req = httpTestingController.expectOne(`${service['url']}/${serviceId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockServices[0]);
  });

  it('should create a new service', () => {
    service.createService(newService).subscribe(service => {
      expect(service).toEqual(newService);
    });

    const req = httpTestingController.expectOne(service['url']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newService);
    req.flush(newService);
  });

  it('should update a service', () => {
    const serviceId = '1';
    const updatedData = { title: 'Terapia Actualizada' };

    service.updateService(serviceId, updatedData).subscribe(service => {
      expect(service.title).toBe('Terapia Actualizada');
    });

    const req = httpTestingController.expectOne(`${service['url']}/${serviceId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedData);
    req.flush({...mockServices[0], ...updatedData});
  });

  it('should delete a service', () => {
    const serviceId = '1';

    service.deleteService(serviceId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${service['url']}/${serviceId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should handle errors', () => {
    const errorMessage = 'Test error';

    service.getServices().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('Http failure response');
      }
    });

    const req = httpTestingController.expectOne(service['url']);
    req.flush(errorMessage, {
      status: 404,
      statusText: 'Not Found'
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
