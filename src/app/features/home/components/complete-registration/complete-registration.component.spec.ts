import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsersRepoService } from '../../../../core/services/users.repo.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../../models/user.model';
import CompleteRegistrationComponent from './complete-registration.component';

describe('CompleteRegistrationComponent', () => {
  let component: CompleteRegistrationComponent;
  let fixture: ComponentFixture<CompleteRegistrationComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: {
    snapshot: {
      queryParamMap: {
        get: jasmine.Spy;
      };
    };
  };
  let mockUsersRepoService: jasmine.SpyObj<UsersRepoService>;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    approved: false,
    avatar: undefined,
    password: 'password123'
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(CompleteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUsersRepoService = jasmine.createSpyObj('UsersRepoService', ['updateUser']);

    mockActivatedRoute = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy('get')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CompleteRegistrationComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UsersRepoService, useValue: mockUsersRepoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    createComponent();
    expect(component.form).toBeDefined();
    expect(component.form.controls['name']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
    expect(component.form.controls['name'].hasError('required')).toBeTruthy();
    expect(component.form.controls['password'].hasError('required')).toBeTruthy();
  });

  it('should show modal when token is present', () => {
    mockActivatedRoute.snapshot.queryParamMap.get.and.returnValue('test-token');
    createComponent();
    expect(component.showModal()).toBeTrue();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: { token: null } });
  });

  it('should not show modal when token is not present', () => {
    mockActivatedRoute.snapshot.queryParamMap.get.and.returnValue(null);
    createComponent();
    expect(component.showModal()).toBeFalse();
  });

  it('should handle file change', () => {
    createComponent();
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    component.handleFileChange(mockEvent);
    expect(component.file).toBe(mockFile);
  });

  it('should close modal', () => {
    createComponent();
    component.showModal.set(true);
    component.closeModal();
    expect(component.showModal()).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    createComponent();
    component.form.setValue({ name: '', password: '' });
    component.submit();
    expect(mockUsersRepoService.updateUser).not.toHaveBeenCalled();
  });

  it('should submit form when valid and set success', async () => {
    createComponent();
    const mockPayload = { id: '123' };
    const validToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;
    component.registrationToken = validToken;

    mockUsersRepoService.updateUser.and.returnValue(of(mockUser));

    component.form.setValue({
      name: 'Test User',
      password: 'ValidPassword123'
    });

    component.form.markAsDirty();
    component.form.markAllAsTouched();

    await component.submit();

    expect(mockUsersRepoService.updateUser).toHaveBeenCalledWith(
      '123',
      jasmine.any(FormData),
      validToken
    );
    expect(component.success()).toBeTrue();
  });

  it('should log error when registration fails', async () => {
    createComponent();
    const mockPayload = { id: '123' };
    const validToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;
    component.registrationToken = validToken;

    const testError = new Error('Test error');
    mockUsersRepoService.updateUser.and.returnValue(throwError(() => testError));
    spyOn(console, 'error');

    component.form.setValue({
      name: 'Test User',
      password: 'ValidPassword123'
    });

    await component.submit();

    expect(console.error).toHaveBeenCalledWith('Registration error:', testError);
  });

  it('should include avatar file when submitting if file exists', async () => {
    createComponent();
    const mockPayload = { id: '123' };
    const validToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;
    component.registrationToken = validToken;

    component.form.setValue({
      name: 'Test User',
      password: 'ValidPassword123'
    });

    const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
    component.file = mockFile;

    mockUsersRepoService.updateUser.and.returnValue(of(mockUser));

    await component.submit();

    const formData = mockUsersRepoService.updateUser.calls.mostRecent().args[1] as FormData;
    expect(formData.get('avatar')).toBe(mockFile);
  });

  it('should not include avatar when no file is selected', async () => {
    createComponent();
    const mockPayload = { id: '123' };
    const validToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;
    component.registrationToken = validToken;

    component.form.setValue({
      name: 'Test User',
      password: 'ValidPassword123'
    });

    component.file = null;

    mockUsersRepoService.updateUser.and.returnValue(of(mockUser));

    await component.submit();

    const formData = mockUsersRepoService.updateUser.calls.mostRecent().args[1] as FormData;
    expect(formData.get('avatar')).toBeNull();
  });
});
