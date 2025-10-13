import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StateService } from './state.service';
import { TherapiesRepoService } from './therapies.repo.service';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Therapy } from '../../models/therapy.model';
import { ApiError } from '../interceptors/error.interceptor';
import { AdvicesRepoService } from './advices.repo.service';
import { Advice } from '../../models/advice.model';
import { User } from '../../models/user.model';

describe('StateService', () => {
  let service: StateService;
  let mockUsersRepo: jasmine.SpyObj<UsersRepoService>;
  let mockTherapiesRepo: jasmine.SpyObj<TherapiesRepoService>;
  let mockAdvicesRepo: jasmine.SpyObj<AdvicesRepoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockToken = 'mock-token';
  const mockUser: User = {
    userId: '123',
    cognitoId: 'cognito-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    approved: true
  };
  const mockTherapy: Therapy = {
    therapyId: '1',
    title: 'Test Therapy',
    description: 'Test Description',
    content: 'Test Content',
    maxParticipants: 1,
    image: {
      key: 'test-key',
      url: 'http://test.com'
    },
    createdAt: '2024-01-01T00:00:00.000Z'
  };
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
    createdAt: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    mockUsersRepo = jasmine.createSpyObj('UsersRepoService', [
      'login', 'completeRegistration', 'updateUser', 'getById'
    ]);
    mockTherapiesRepo = jasmine.createSpyObj('TherapiesRepoService', [
      'getTherapies', 'getTherapyById', 'createTherapy', 'updateTherapy', 'deleteTherapy'
    ]);
    mockAdvicesRepo = jasmine.createSpyObj('AdvicesRepoService', [
      'getAllAdvices', 'getAdvicesByTherapyId', 'getAdviceById', 'createAdvice'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        StateService,
        { provide: UsersRepoService, useValue: mockUsersRepo },
        { provide: TherapiesRepoService, useValue: mockTherapiesRepo },
        { provide: AdvicesRepoService, useValue: mockAdvicesRepo },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(StateService);

    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key === 'token' ? mockToken : null
    );
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    spyOn(window, 'atob').and.callFake(() => JSON.stringify({
      sub: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
      approved: true
    }));

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
      expect(state.therapies.list).toEqual([]);
      expect(state.advices.list).toEqual([]);
    });
  });

  describe('Utility Methods', () => {
    it('should provide readonly state', () => {
      const authState = service.authState();
      const servicesState = service.therapiesState();
      const advicesState = service.advicesState();

      expect(authState.status).toBe('idle');
      expect(authState.currentUser).toBeNull();
      expect(servicesState.list).toEqual([]);
      expect(advicesState.list).toEqual([]);
    });
  });

  describe('Authentication', () => {
    it('should handle successful login', fakeAsync(() => {
      mockUsersRepo.login.and.returnValue(of({ token: mockToken, user: mockUser }));

      service.login('test@example.com', 'password');
      tick();

      const authState = service.authState();
      expect(authState.currentUser).toEqual(mockUser);
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
        userId: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN'
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

      const { auth, therapies: services, advices: advices } = service.state$;

      expect(auth.currentUser).toBeNull();
      expect(auth.token).toBeNull();
      expect(auth.status).toBe('idle');

      expect(services.list).toEqual([]);
      expect(services.current).toBeNull();

      expect(advices.list).toEqual([]);
      expect(advices.current).toBeNull();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    }));

    it('should set default values when token payload is missing fields', fakeAsync(() => {
      (window.atob as jasmine.Spy).and.callFake(() => JSON.stringify({ sub: '2' }));
      (localStorage.getItem as jasmine.Spy).and.returnValue('mock-token');

      service.checkAuth();
      tick();

      const authState = service.authState();
      expect(authState.currentUser).toEqual({
        userId: '2',
        cognitoId: '2',
        name: '',
        email: '',
        role: 'USER',
        approved: true
      });
    }));
  });

  describe('Users Methods', () => {
    it('should complete registration successfully', fakeAsync(() => {
      const response = { message: 'Registration done' };
      mockUsersRepo.completeRegistration.and.returnValue(of(response));

      service.completeRegistration({ registrationToken: 'token', password: 'password', email: 'test@example.com' });
      tick();

      expect(mockUsersRepo.completeRegistration).toHaveBeenCalledWith(jasmine.objectContaining({
        registrationToken: 'token',
        password: 'password',
        email: 'test@example.com'
      }));
    }))

    it('should handle error on complete registration', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockUsersRepo.completeRegistration.and.returnValue(throwError(() => error));

      service.completeRegistration({ registrationToken: 'token', password: 'pass', email: 'test@example.com' });
      tick();

      expect(console.error).toHaveBeenCalledWith('Error completing registration:', 'Bad Request');
    }));

    it('should update user profile successfully', fakeAsync(() => {
      const updatedUser: User = { ...mockUser, name: 'Updated User' };
      mockUsersRepo.updateUser.and.returnValue(of(updatedUser));

      service.updateUserProfile('123', new FormData());
      tick();

      expect(service.authState().currentUser).toEqual(updatedUser);
    }));

    it('should handle error on update user profile', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockUsersRepo.updateUser.and.returnValue(throwError(() => error));

      service.updateUserProfile('123', new FormData());
      tick();

      expect(console.error).toHaveBeenCalledWith('Error updating profile:', 'Server Error');
    }));
  })

  describe('Therapies Management', () => {
    it('should load therapies', fakeAsync(() => {
      mockTherapiesRepo.getTherapies.and.returnValue(of([mockTherapy]));

      service.loadTherapies();
      tick();

      const therapyState = service.therapiesState();
      expect(therapyState.list.length).toBe(1);
      expect(therapyState.list[0]).toEqual(mockTherapy);
    }));

    it('should handle loading error', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Internal server error' };
      mockTherapiesRepo.getTherapies.and.returnValue(throwError(() => error));

      service.loadTherapies();
      tick();

      const therapyState = service.therapiesState();
      expect(therapyState.list).toEqual([]);
      expect(therapyState.error).toBe('Internal server error');
    }));

    it('should load therapy by id', fakeAsync(() => {
      mockTherapiesRepo.getTherapyById.and.returnValue(of(mockTherapy));

      service.loadTherapyById('1');
      tick();

      const therapyState = service.therapiesState();
      expect(therapyState.current).toEqual(mockTherapy);
    }));

    it('should handle error when loading therapy by id', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockTherapiesRepo.getTherapyById.and.returnValue(throwError(() => error));

      service.loadTherapyById('1');
      tick();

      const therapyState = service.therapiesState();
      expect(therapyState.current).toBeNull();
      expect(therapyState.error).toBe('Not Found');
    }));

    it('should create new therapy', fakeAsync(() => {
      const newTherapy: Therapy = { ...mockTherapy, therapyId: '2' };
      mockTherapiesRepo.createTherapy.and.returnValue(of(newTherapy));

      service.createTherapy(newTherapy);
      tick();

      const therapyState = service.therapiesState();
      expect(therapyState.list).toContain(newTherapy);
    }));

    it('should handle error when creating therapy', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockTherapiesRepo.createTherapy.and.returnValue(throwError(() => error));

      service.createTherapy(mockTherapy);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating therapy:', 'Bad Request');
    }));

    it('should correctly update the specific therapy in list and set as current', fakeAsync(() => {
      const initialTherapy1 = { ...mockTherapy, therapyId: '1', title: 'Original 1' };
      const initialTherapy2 = { ...mockTherapy, therapyId: '2', title: 'Original 2' };
      const updatedTherapy = { ...mockTherapy, therapyId: '1', title: 'Updated' };

      mockTherapiesRepo.getTherapies.and.returnValue(of([initialTherapy1, initialTherapy2]));
      service.loadTherapies();
      tick();

      mockTherapiesRepo.updateTherapy.and.returnValue(of(updatedTherapy));
      service.updateTherapy('1', { title: 'Updated' });
      tick();

      const therapyState = service.therapiesState();
      const updated = therapyState.list.find(s => s.therapyId === '1');
      const unchanged = therapyState.list.find(s => s.therapyId === '2');

      expect(therapyState.list.length).toBe(2);
      expect(updated?.title).toBe('Updated');
      expect(unchanged?.title).toBe('Original 2');
      expect(therapyState.current).toEqual(updatedTherapy);
    }));

    it('should handle error when updating therapy', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockTherapiesRepo.updateTherapy.and.returnValue(throwError(() => error));

      service.updateTherapy('1', { title: 'Updated' });
      tick();

      expect(console.error).toHaveBeenCalledWith('Error updating therapy:', 'Not Found');
    }));

    it('should delete therapy', fakeAsync(() => {
      mockTherapiesRepo.getTherapies.and.returnValue(of([mockTherapy]));
      service.loadTherapies();
      tick();

      mockTherapiesRepo.deleteTherapy.and.returnValue(of(undefined));

      service.deleteTherapy('1');
      tick();

      const TherapyState = service.therapiesState();
      expect(TherapyState.list).toEqual([]);
      expect(TherapyState.current).toBeNull();
    }));

    it('should handle error when deleting therapy', fakeAsync(() => {
      const error: ApiError = { status: 403, message: 'Forbidden' };
      mockTherapiesRepo.deleteTherapy.and.returnValue(throwError(() => error));

      service.deleteTherapy('1');
      tick();

      expect(console.error).toHaveBeenCalledWith('Error deleting therapy:', 'Forbidden');
    }));
  });

  describe('Advices Management', () => {
    it('should load all advices', fakeAsync(() => {
      mockAdvicesRepo.getAllAdvices.and.returnValue(of([mockAdvice]));

      service.loadAllAdvices();
      tick();

      const advicesState = service.advicesState();
      expect(advicesState.list.length).toBe(1);
      expect(advicesState.list[0]).toEqual(mockAdvice);
    }));

    it('should handle error when loading all advices', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockAdvicesRepo.getAllAdvices.and.returnValue(throwError(() => error));

      service.loadAllAdvices();
      tick();

      const adviceState = service.advicesState();
      expect(adviceState.list).toEqual([]);
      expect(adviceState.error).toBe('Server Error');
    }));

    it('should load advices by therapy id', fakeAsync(() => {
      mockAdvicesRepo.getAdvicesByTherapyId.and.returnValue(of([mockAdvice]));

      service.loadAdvicesByTherapyId('1');
      tick();

      const adviceState = service.advicesState();
      expect(adviceState.filtered.length).toBe(1);
      expect(adviceState.filtered[0]).toEqual(mockAdvice);
    }));

    it('should handle error when loading advices by therapy id', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockAdvicesRepo.getAdvicesByTherapyId.and.returnValue(throwError(() => error));

      service.loadAdvicesByTherapyId('1');
      tick();

      const adviceState = service.advicesState();
      expect(adviceState.filtered).toEqual([]);
      expect(adviceState.error).toBe('Not Found');
    }));

    it('should load advice by id', fakeAsync(() => {
      mockAdvicesRepo.getAdviceById.and.returnValue(of(mockAdvice));

      service.loadAdviceById('1');
      tick();

      const adviceState = service.advicesState();
      expect(adviceState.current).toEqual(mockAdvice);
    }));

    it('should handle error when loading advice by id', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockAdvicesRepo.getAdviceById.and.returnValue(throwError(() => error));

      service.loadAdviceById('1');
      tick();

      const adviceState = service.advicesState();
      expect(adviceState.current).toBeNull();
      expect(adviceState.error).toBe('Not Found');
    }));

    it('should create new advice', fakeAsync(() => {
      const newAdvice: Advice = { ...mockAdvice, adviceId: '2' };
      mockAdvicesRepo.createAdvice.and.returnValue(of(newAdvice));

      service.createAdvice(newAdvice);
      tick();

      expect(service.advicesState().list).toContain(newAdvice);
    }));

    it('should handle error when creating advice', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockAdvicesRepo.createAdvice.and.returnValue(throwError(() => error));

      service.createAdvice(mockAdvice);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating advice:', 'Bad Request');
    }));
  })
});
