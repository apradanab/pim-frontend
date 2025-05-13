import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { ServicesRepoService } from './services.repo.service';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Service } from '../../models/service.model';
import { User } from '../../models/user.model';
import { ApiError } from '../interceptors/error.interceptor';

interface StateServicePrivateAccess {
  authState: () => {
    currentUser: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
  };
  servicesState: {
    set: (state: { services: Service[]; currentService: Service | null }) => void;
  };
}

describe('StateService', () => {
  let service: StateService;
  let mockServicesRepo: jasmine.SpyObj<ServicesRepoService>;
  let mockUsersRepo: jasmine.SpyObj<UsersRepoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockService: Service = {
    id: '1',
    title: 'Test Service',
    description: 'Test Description',
    content: 'Test Content',
    image: 'test-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockService2: Service = {
    id: '2',
    title: 'Test Service 2',
    description: 'Test Description 2',
    content: 'Test Content 2',
    image: 'test-image2.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTokenPayload = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER' as const,
    approved: true
  };

  const mockTokenPayloadWithoutDates = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER' as const,
    approved: true
  };

  const mockUser: User = { ...mockTokenPayload };

  const mockToken = 'mock.token';
  const mockTokenWithoutDates = 'mock.token.without.dates';

  beforeEach(() => {
    mockServicesRepo = jasmine.createSpyObj('ServicesRepoService', [
      'getServices', 'getServiceById', 'createService', 'updateService', 'deleteService'
    ]);
    mockUsersRepo = jasmine.createSpyObj('UsersRepoService', [
      'login', 'completeRegistration'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        StateService,
        { provide: ServicesRepoService, useValue: mockServicesRepo },
        { provide: UsersRepoService, useValue: mockUsersRepo },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(StateService);

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    spyOn(window, 'atob').and.callFake((encoded) => {
      if (encoded === mockTokenWithoutDates) {
        return JSON.stringify(mockTokenPayloadWithoutDates);
      }
      return JSON.stringify(mockTokenPayload);
    });
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should initialize with empty auth state', () => {
      expect(service.currentUser()).toBeNull();
      expect(service.token()).toBeNull();
    });

    it('should initialize with empty services state', () => {
      expect(service.state$().services).toEqual([]);
      expect(service.state$().currentService).toBeNull();
    });
  });

  describe('Authentication', () => {
    it('should handle successful login', () => {
      mockUsersRepo.login.and.returnValue(of({ token: mockToken }));

      service.login('test@example.com', 'password');

      expect(service.currentUser()?.id).toEqual(mockUser.id);
      expect(service.token()).toBe(mockToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle login error with custom message', () => {
      const errorResponse: ApiError = {
        status: 401,
        message: 'Invalid credentials'
      };
      mockUsersRepo.login.and.returnValue(throwError(() => errorResponse));

      service.login('fail@example.com', 'wrong');

      const authState = (service as unknown as StateServicePrivateAccess).authState();
      expect(authState.status).toBe('error');
      expect(authState.error).toBe('Invalid credentials');
    });

    it('should logout correctly', () => {
      service.logout();
      expect(service.currentUser()).toBeNull();
      expect(service.token()).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should check auth with valid token', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);

      service.checkAuth();

      expect(service.currentUser()?.id).toEqual(mockUser.id);
      expect(service.token()).toBe(mockToken);
    });

    it('should do nothing when no token exists', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      const initialAuthState = service.currentUser();

      service.checkAuth();

      expect(service.currentUser()).toBe(initialAuthState);
      expect(localStorage.removeItem).not.toHaveBeenCalled();
    })

    it('should handle complete registration successfully', () => {
      mockUsersRepo.completeRegistration.and.returnValue(of(mockUser));

      service.completeRegistration('token', 'password');

      expect(service.currentUser()?.id).toEqual(mockUser.id);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle complete registration error with custom message', () => {
      const errorResponse: ApiError = {
        status: 400,
        message: 'Token expired'
      };
      mockUsersRepo.completeRegistration.and.returnValue(throwError(() => errorResponse));

      service.completeRegistration('expired-token', 'password');

      const authState = (service as unknown as StateServicePrivateAccess).authState();
      expect(authState.status).toBe('error');
      expect(authState.error).toBe('Token expired');
    });
  });

  describe('Services Management', () => {
    it('should load services successfully', () => {
      mockServicesRepo.getServices.and.returnValue(of([mockService]));

      service.loadServices();

      expect(service.state$().services).toEqual([mockService]);
    });

    it('should handle error when loading services', () => {
      const errorResponse: ApiError = {
        status: 500,
        message: 'Server error'
      };
      mockServicesRepo.getServices.and.returnValue(throwError(() => errorResponse));

      service.loadServices();

      expect(service.state$().services).toEqual([]);
    });

    it('should load service by id successfully', () => {
      mockServicesRepo.getServiceById.and.returnValue(of(mockService));

      service.loadServiceById('1');

      expect(service.state$().currentService).toEqual(mockService);
    });

    it('should handle error when loading service by id', () => {
      const errorResponse: ApiError = {
        status: 404,
        message: 'Service not found'
      };
      mockServicesRepo.getServiceById.and.returnValue(throwError(() => errorResponse));

      service.loadServiceById('1');

      expect(service.state$().currentService).toBeNull();
    });

    it('should create service', () => {
      mockServicesRepo.createService.and.returnValue(of(mockService));

      service.createService(mockService);

      expect(service.state$().services).toContain(mockService);
    });

    it('should handle error when creating service', () => {
      const errorResponse: ApiError = {
        status: 400,
        message: 'Bad request'
      };
      mockServicesRepo.createService.and.returnValue(throwError(() => errorResponse));

      const initialServices = service.state$().services;
      service.createService(mockService);

      expect(service.state$().services).toEqual(initialServices);
    });

    it('should update service and keep others unchanged', () => {
      const initialServices = [mockService, mockService2];
      const updatedService = { ...mockService, title: 'Updated Title' };

      mockServicesRepo.updateService.and.returnValue(of(updatedService));
      (service as unknown as StateServicePrivateAccess).servicesState.set({
        services: initialServices,
        currentService: mockService
      });

      service.updateService('1', { title: 'Updated Title' });

      const state = service.state$();
      expect(state.services.length).toBe(2);
      expect(state.services.find(s => s.id === '1')?.title).toBe('Updated Title');
      expect(state.services.find(s => s.id === '2')?.title).toBe(mockService2.title);
    });

    it('should handle error when updating service', () => {
      const initialServices = [mockService];
      const errorResponse: ApiError = {
        status: 404,
        message: 'Service not found'
      };

      mockServicesRepo.updateService.and.returnValue(throwError(() => errorResponse));
      (service as unknown as StateServicePrivateAccess).servicesState.set({
        services: initialServices,
        currentService: mockService
      });

      service.updateService('1', { title: 'New Title' });

      const state = service.state$();
      expect(state.services).toEqual(initialServices);
      expect(state.currentService).toEqual(mockService);
    });

    it('should delete service', () => {
      (service as unknown as StateServicePrivateAccess).servicesState.set({
        services: [mockService],
        currentService: mockService
      });
      mockServicesRepo.deleteService.and.returnValue(of(undefined));

      service.deleteService('1');

      expect(service.state$().services).toEqual([]);
    });

    it('should handle error when deleting service', () => {
      const initialServices = [mockService];
      const errorResponse: ApiError = {
        status: 403,
        message: 'Forbidden'
      };

      (service as unknown as StateServicePrivateAccess).servicesState.set({
        services: initialServices,
        currentService: mockService
      });
      mockServicesRepo.deleteService.and.returnValue(throwError(() => errorResponse));

      service.deleteService('1');

      const state = service.state$();
      expect(state.services).toEqual(initialServices);
      expect(state.currentService).toEqual(mockService);
    });
  });
});
