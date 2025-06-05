import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StateService } from './state.service';
import { ServicesRepoService } from './services.repo.service';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Service } from '../../models/service.model';
import { ApiError } from '../interceptors/error.interceptor';
import { ResourcesRepoService } from './resources.repo.service';
import { Resource } from '../../models/resource.model';

describe('StateService', () => {
  let service: StateService;
  let mockUsersRepo: jasmine.SpyObj<UsersRepoService>;
  let mockServicesRepo: jasmine.SpyObj<ServicesRepoService>;
  let mockResourcesRepo: jasmine.SpyObj<ResourcesRepoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockToken = 'mock-token';
  const mockDecodedToken = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'ADMIN',
    approved: true
  };
  const mockService: Service = {
    id: '1',
    title: 'Test Service',
    description: 'Test Description',
    content: 'Test Content',
    image: 'test-image.jpg',
    createdAt: new Date('2025-05-29T17:25:06Z'),
    updatedAt: new Date('2025-05-29T17:25:06Z')
  };
  const mockResource: Resource = {
    id: '1',
    title: 'Test Resource',
    description: 'Test Description',
    content: 'Test Content',
    image: 'http://test.com',
    createdAt: new Date('2025-05-29T17:25:06Z'),
    updatedAt: new Date('2025-05-29T17:25:06Z'),
    serviceId: '1',
  }

  beforeEach(() => {
    mockUsersRepo = jasmine.createSpyObj('UsersRepoService', [
      'login', 'getById'
    ]);
    mockServicesRepo = jasmine.createSpyObj('ServicesRepoService', [
      'getServices', 'getServiceById', 'createService', 'updateService', 'deleteService'
    ]);
    mockResourcesRepo = jasmine.createSpyObj('ResourcesRepoService', [
      'getAllResources', 'getResourcesByServiceId', 'getResourceById', 'createResource'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        StateService,
        { provide: UsersRepoService, useValue: mockUsersRepo },
        { provide: ServicesRepoService, useValue: mockServicesRepo },
        { provide: ResourcesRepoService, useValue: mockResourcesRepo },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(StateService);

    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key === 'token' ? mockToken : null
    );
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    spyOn(window, 'atob').and.callFake(() => JSON.stringify(mockDecodedToken));

    spyOn(console, 'error');
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const state = service.state$;
      expect(state.auth.currentUser).toBeNull();
      expect(state.auth.token).toBeNull();
      expect(state.services.list).toEqual([]);
      expect(state.resources.list).toEqual([]);
    });
  });

  describe('Utility Methods', () => {
    it('should provide readonly state', () => {
      const authState = service.authState();
      const servicesState = service.servicesState();
      const resourcesState = service.resourcesState();

      expect(authState.status).toBe('idle');
      expect(authState.currentUser).toBeNull();
      expect(servicesState.list).toEqual([]);
      expect(resourcesState.list).toEqual([]);
    });
  });

  describe('Authentication', () => {
    it('should handle successful login', fakeAsync(() => {
      mockUsersRepo.login.and.returnValue(of({ token: mockToken }));

      service.login('test@example.com', 'password');
      tick();

      const authState = service.authState();
      expect(authState.currentUser).toEqual(jasmine.objectContaining({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }));
      expect(authState.token).toBe(mockToken);
      expect(authState.status).toBe('success');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should handle login error', fakeAsync(() => {
      const error: ApiError = { status: 401, message: 'Authentication required' };
      mockUsersRepo.login.and.returnValue(throwError(() => error));

      service.login('fail@example.com', 'wrongpassword');
      tick();

      const authState = service.authState();
      expect(authState.status).toBe('error');
      expect(authState.error).toBe('Authentication required');
    }));

    it('should validate token on checkAuth', fakeAsync(() => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);

      service.checkAuth();
      tick();

      const authState = service.authState();
      expect(authState.currentUser).toEqual(jasmine.objectContaining({
        id: '1',
        name: 'Test User'
      }));
      expect(authState.token).toBe(mockToken);
    }));

    it('should logout when token is invalid', fakeAsync(() => {
      (window.atob as jasmine.Spy).and.throwError('Invalid token');
      (localStorage.getItem as jasmine.Spy).and.returnValue('invalid-token');

      service.checkAuth();
      tick();

      const authState = service.authState();
      expect(authState.currentUser).toBeNull();
      expect(authState.token).toBeNull();
    }));

    it('should clear state on logout', fakeAsync(() => {
      service.logout();

      const { auth, services, resources } = service.state$;

      expect(auth.currentUser).toBeNull();
      expect(auth.token).toBeNull();
      expect(auth.status).toBe('idle');

      expect(services.list).toEqual([]);
      expect(services.current).toBeNull();

      expect(resources.list).toEqual([]);
      expect(resources.current).toBeNull();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    }));
  });

  describe('Services Management', () => {
    it('should load services', fakeAsync(() => {
      mockServicesRepo.getServices.and.returnValue(of([mockService]));

      service.loadServices();
      tick();

      const servicesState = service.servicesState();
      expect(servicesState.list.length).toBe(1);
      expect(servicesState.list[0]).toEqual(mockService);
    }));

    it('should handle loading error', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Internal server error' };
      mockServicesRepo.getServices.and.returnValue(throwError(() => error));

      service.loadServices();
      tick();

      const servicesState = service.servicesState();
      expect(servicesState.list).toEqual([]);
      expect(servicesState.error).toBe('Internal server error');
    }));

    it('should load service by id', fakeAsync(() => {
      mockServicesRepo.getServiceById.and.returnValue(of(mockService));

      service.loadServiceById('1');
      tick();

      const servicesState = service.servicesState();
      expect(servicesState.current).toEqual(mockService);
    }));

    it('should handle error when loading service by id', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockServicesRepo.getServiceById.and.returnValue(throwError(() => error));

      service.loadServiceById('1');
      tick();

      const servicesState = service.servicesState();
      expect(servicesState.current).toBeNull();
      expect(servicesState.error).toBe('Not Found');
    }));

    it('should create new service', fakeAsync(() => {
      const newService: Service = { ...mockService, id: '2' };
      mockServicesRepo.createService.and.returnValue(of(newService));

      service.createService(newService);
      tick();

      const serviceState = service.servicesState();
      expect(serviceState.list).toContain(newService);
    }));

    it('should handle error when creating service', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockServicesRepo.createService.and.returnValue(throwError(() => error));

      service.createService(mockService);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating service:', 'Bad Request');
    }));

    it('should correctly update the specific service in list and set as current', fakeAsync(() => {
      const initialService1 = { ...mockService, id: '1', title: 'Original 1' };
      const initialService2 = { ...mockService, id: '2', title: 'Original 2' };
      const updatedService = { ...mockService, id: '1', title: 'Updated' };

      mockServicesRepo.getServices.and.returnValue(of([initialService1, initialService2]));
      service.loadServices();
      tick();

      mockServicesRepo.updateService.and.returnValue(of(updatedService));
      service.updateService('1', { title: 'Updated' });
      tick();

      const servicesState = service.servicesState();
      const updated = servicesState.list.find(s => s.id === '1');
      const unchanged = servicesState.list.find(s => s.id === '2');

      expect(servicesState.list.length).toBe(2);
      expect(updated?.title).toBe('Updated');
      expect(unchanged?.title).toBe('Original 2');
      expect(servicesState.current).toEqual(updatedService);
    }));

    it('should handle error when updating service', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockServicesRepo.updateService.and.returnValue(throwError(() => error));

      service.updateService('1', { title: 'Updated' });
      tick();

      expect(console.error).toHaveBeenCalledWith('Error updating service:', 'Not Found');
    }));

    it('should delete service', fakeAsync(() => {
      mockServicesRepo.getServices.and.returnValue(of([mockService]));
      service.loadServices();
      tick();

      mockServicesRepo.deleteService.and.returnValue(of(undefined));

      service.deleteService('1');
      tick();

      const servicesState = service.servicesState();
      expect(servicesState.list).toEqual([]);
      expect(servicesState.current).toBeNull();
    }));

    it('should handle error when deleting service', fakeAsync(() => {
      const error: ApiError = { status: 403, message: 'Forbidden' };
      mockServicesRepo.deleteService.and.returnValue(throwError(() => error));

      service.deleteService('1');
      tick();

      expect(console.error).toHaveBeenCalledWith('Error deleting service:', 'Forbidden');
    }));
  });

  describe('Resources Management', () => {
    it('should load all resources', fakeAsync(() => {
      mockResourcesRepo.getAllResources.and.returnValue(of([mockResource]));

      service.loadAllResources();
      tick();

      const resourcesState = service.resourcesState();
      expect(resourcesState.list.length).toBe(1);
      expect(resourcesState.list[0]).toEqual(mockResource);
    }));

    it('should handle error when loading all resources', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockResourcesRepo.getAllResources.and.returnValue(throwError(() => error));

      service.loadAllResources();
      tick();

      const resourcesState = service.resourcesState();
      expect(resourcesState.list).toEqual([]);
      expect(resourcesState.error).toBe('Server Error');
    }));

    it('should load resources by service id', fakeAsync(() => {
      mockResourcesRepo.getResourcesByServiceId.and.returnValue(of([mockResource]));

      service.loadResourcesByServiceId('1');
      tick();

      const resourcesState = service.resourcesState();
      expect(resourcesState.filtered.length).toBe(1);
      expect(resourcesState.filtered[0]).toEqual(mockResource);
    }));

    it('should handle error when loading resources by service id', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockResourcesRepo.getResourcesByServiceId.and.returnValue(throwError(() => error));

      service.loadResourcesByServiceId('1');
      tick();

      const resourcesState = service.resourcesState();
      expect(resourcesState.filtered).toEqual([]);
      expect(resourcesState.error).toBe('Not Found');
    }));

    it('should load resource by id', fakeAsync(() => {
      mockResourcesRepo.getResourceById.and.returnValue(of(mockResource));

      service.loadResourceById('1');
      tick();

      const resourcesState = service.resourcesState();
      expect(resourcesState.current).toEqual(mockResource);
    }));

    it('should handle error when loading resource by id', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockResourcesRepo.getResourceById.and.returnValue(throwError(() => error));

      service.loadResourceById('1');
      tick();

      const resourcesState = service.resourcesState();
      expect(resourcesState.current).toBeNull();
      expect(resourcesState.error).toBe('Not Found');
    }));

    it('should create new resource', fakeAsync(() => {
      const newResource: Resource = { ...mockResource, id: '2' };
      mockResourcesRepo.createResource.and.returnValue(of(newResource));

      service.createResource(newResource);
      tick();

      expect(service.resourcesState().list).toContain(newResource);
    }));

    it('should handle error when creating resource', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockResourcesRepo.createResource.and.returnValue(throwError(() => error));

      service.createResource(mockResource);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating resource:', 'Bad Request');
    }));
  })
});
