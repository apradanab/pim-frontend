import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersRepoService } from './users.repo.service';
import { User, UserCreateDto, UserLoginDto } from '../../models/user.model';
import { provideHttpClient } from '@angular/common/http';

describe('UsersRepoService', () => {
  let service: UsersRepoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UsersRepoService
      ]
    });
    service = TestBed.inject(UsersRepoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call preregister', () => {
    const mockUser: UserCreateDto = {
      name: 'Test',
      email: 'test@test.com',
      message: 'Test message'
    };
    const mockResponse = {} as User;

    service.preregister(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = http.expectOne(`${service['authUrl']}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call login', () => {
    const mockLogin: UserLoginDto = {
      email: 'test@test.com',
      password: 'password'
    };
    const mockResponse = { token: 'mock-token', user: {} as User };

    service.login(mockLogin).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = http.expectOne(`${service['authUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call getById', () => {
    const mockId = '123';
    const mockResponse = {} as User;

    service.getById(mockId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = http.expectOne(`${service['url']}/${mockId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call updateUser', () => {
    const mockId = '123';
    const mockFormData = new FormData();
    mockFormData.append('name', 'Updated Name');
    const mockResponse = {} as User;

    service.updateUser(mockId, mockFormData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = http.expectOne(`${service['url']}/${mockId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toBe(mockFormData);
    req.flush(mockResponse);
  });

  it('should call completeRegistration', () => {
    const mockData = {
      registrationToken: 'token-123',
      password: 'password123',
      email: 'test@test.com',
      name: 'Test User'
    };
    const mockResponse = { message: 'Registration completed' };

    service.completeRegistration(mockData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = http.expectOne(`${service['authUrl']}/complete-registration`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
