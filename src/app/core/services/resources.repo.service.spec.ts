import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ResourcesRepoService } from './resources.repo.service';
import { Resource } from '../../models/resource.model';

describe('ResourcesRepoService', () => {
  let service: ResourcesRepoService;
  let httpTestingController: HttpTestingController;

  const mockResource: Resource = {
    id: '1',
    title: 'Test Resource',
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
        ResourcesRepoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ResourcesRepoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all resources', () => {
    const mockResources: Resource[] = [mockResource];

    service.getAllResources().subscribe(resources => {
      expect(resources).toEqual(mockResources);
    });

    const req = httpTestingController.expectOne(service['url']);
    expect(req.request.method).toBe('GET');
    req.flush(mockResources);
  });

  it('should get resource by id', () => {
    service.getResourceById('1').subscribe(resource => {
      expect(resource).toEqual(mockResource);
    });

    const req = httpTestingController.expectOne(`${service['url']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResource);
  });

  it('should get resources by service id', () => {
    const mockResources: Resource[] = [mockResource];

    service.getResourcesByServiceId('1').subscribe(resources => {
      expect(resources).toEqual(mockResources);
    });

    const req = httpTestingController.expectOne(`${service['url']}/service/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResources);
  });

  it('should create a new resource', () => {
    const newResource: Resource = { ...mockResource, id: '2' };

    service.createResource(newResource).subscribe(resource => {
      expect(resource).toEqual(newResource);
    });

    const req = httpTestingController.expectOne(service['url']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newResource);
    req.flush(newResource);
  });
});
