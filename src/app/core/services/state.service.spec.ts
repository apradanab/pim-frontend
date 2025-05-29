import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StateService } from './state.service';
import { ServicesRepoService } from './services.repo.service';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Service } from '../../models/service.model';
import { ApiError } from '../interceptors/error.interceptor';

describe('StateService', () => {
  let service: StateService;
  let mockServicesRepo: jasmine.SpyObj<ServicesRepoService>;
  let mockUsersRepo: jasmine.SpyObj<UsersRepoService>;
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

  beforeEach(() => {
    mockServicesRepo = jasmine.createSpyObj('ServicesRepoService', [
      'getServices', 'getServiceById', 'createService', 'updateService', 'deleteService'
    ]);
    mockUsersRepo = jasmine.createSpyObj('UsersRepoService', [
      'login', 'getById'
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
      const state = service.state$();
      expect(state.currentUser).toBeNull();
      expect(state.token).toBeNull();
      expect(state.services).toEqual([]);
    });
  });

  describe('Utility Methods', () => {
    it('should provide readonly state', () => {
      const state = service.state$();
      expect(state.authStatus).toBe('idle');
      expect(state.currentUser).toBeNull();
    });
  });

  describe('Authentication', () => {
    it('should handle successful login', fakeAsync(() => {
      mockUsersRepo.login.and.returnValue(of({ token: mockToken }));

      service.login('test@example.com', 'password');
      tick();

      const state = service.state$();
      expect(state.currentUser).toEqual(jasmine.objectContaining({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }));
      expect(state.token).toBe(mockToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should handle login error', fakeAsync(() => {
      const error: ApiError = { status: 401, message: 'Unauthorized' };
      mockUsersRepo.login.and.returnValue(throwError(() => error));

      service.login('fail@example.com', 'wrong');
      tick();

      const state = service.state$();
      expect(state.authStatus).toBe('error');
      expect(state.error).toBe('Unauthorized');
    }));

    it('should validate token on checkAuth', fakeAsync(() => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);

      service.checkAuth();
      tick();

      const state = service.state$();
      expect(state.currentUser).toEqual(jasmine.objectContaining({
        id: '1',
        name: 'Test User'
      }));
      expect(state.token).toBe(mockToken);
    }));

    it('should logout when token is invalid', fakeAsync(() => {
      (window.atob as jasmine.Spy).and.throwError('Invalid token');
      (localStorage.getItem as jasmine.Spy).and.returnValue('invalid-token');

      service.checkAuth();
      tick();

      const state = service.state$();
      expect(state.currentUser).toBeNull();
      expect(state.token).toBeNull();
    }));

    it('should clear state on logout', fakeAsync(() => {
      mockUsersRepo.login.and.returnValue(of({ token: mockToken }));
      service.login('test@example.com', 'password');
      tick();

      service.logout();

      const state = service.state$();
      expect(state.currentUser).toBeNull();
      expect(state.token).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    }));
  });

  describe('Services Management', () => {
    it('should load services', fakeAsync(() => {
      mockServicesRepo.getServices.and.returnValue(of([mockService]));

      service.loadServices();
      tick();

      const state = service.state$();
      expect(state.services.length).toBe(1);
      expect(state.services[0]).toEqual(mockService);
    }));

    it('should handle loading error', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockServicesRepo.getServices.and.returnValue(throwError(() => error));

      service.loadServices();
      tick();

      const state = service.state$();
      expect(state.services).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error loading services:', 'Server Error');
    }));

    it('should load service by id', fakeAsync(() => {
      mockServicesRepo.getServiceById.and.returnValue(of(mockService));

      service.loadServiceById('1');
      tick();

      const state = service.state$();
      expect(state.currentService).toEqual(mockService);
    }));

    it('should handle error when loading service by id', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockServicesRepo.getServiceById.and.returnValue(throwError(() => error));

      service.loadServiceById('1');
      tick();

      const state = service.state$();
      expect(state.currentService).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error loading service 1:', 'Not Found');
    }));

    it('should create new service', fakeAsync(() => {
      const newService: Service = { ...mockService, id: '2' };
      mockServicesRepo.createService.and.returnValue(of(newService));

      service.createService(newService);
      tick();

      const state = service.state$();
      expect(state.services).toContain(newService);
    }));

    it('should handle error when creating service', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockServicesRepo.createService.and.returnValue(throwError(() => error));

      service.createService(mockService);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating service:', 'Bad Request');
    }));

    it('should correctly update the specific service', fakeAsync(() => {
      const initialService = { ...mockService, id: '1', title: 'Original' };
      const anotherService = { ...mockService, id: '2', title: 'Another' };
      const updatedService = { ...mockService, id: '1', title: 'Updated' };

      mockServicesRepo.getServices.and.returnValue(of([initialService, anotherService]));
      service.loadServices();
      tick();

      mockServicesRepo.updateService.and.returnValue(of(updatedService));
      service.updateService('1', { title: 'Updated' });
      tick();

      const state = service.state$();
      expect(state.services.length).toBe(2);
      expect(state.services.find(s => s.id === '1')?.title).toBe('Updated');
      expect(state.services.find(s => s.id === '2')?.title).toBe('Another');
      expect(state.currentService).toEqual(updatedService);
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

      const state = service.state$();
      expect(state.services).toEqual([]);
      expect(state.currentService).toBeNull();
    }));

    it('should handle error when deleting service', fakeAsync(() => {
      const error: ApiError = { status: 403, message: 'Forbidden' };
      mockServicesRepo.deleteService.and.returnValue(throwError(() => error));

      service.deleteService('1');
      tick();

      expect(console.error).toHaveBeenCalledWith('Error deleting service:', 'Forbidden');
    }));
  });
});
