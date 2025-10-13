import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import CompleteRegistrationComponent from './complete-registration.component';
import { StateService } from '../../../../core/services/state.service';
import { UsersRepoService } from '../../../../core/services/users.repo.service';

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
  let mockStateService: jasmine.SpyObj<StateService>;

  const createComponent = () => {
    fixture = TestBed.createComponent(CompleteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStateService = jasmine.createSpyObj('StateService', ['completeRegistration']);

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
        { provide: StateService, useValue: mockStateService },
        { provide: UsersRepoService, useValue: {} }
      ]
    }).compileComponents();

    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['name']).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
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
    component.showModal.set(true);
    component.closeModal();
    expect(component.showModal()).toBeFalse();
  });

  it('should not submit if form is invalid', async () => {
    component.form.setValue({ name: '', email: '', password: '' });
    await component.submit();
    expect(mockStateService.completeRegistration).not.toHaveBeenCalled();
  });

  it('should submit form when valid and set success', async () => {
    component.registrationToken = 'valid-token';
    component.form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'ValidPassword123'
    });

    await component.submit();

    expect(mockStateService.completeRegistration).toHaveBeenCalledWith({
      registrationToken: 'valid-token',
      name: 'Test User',
      email: 'test@example.com',
      password: 'ValidPassword123'
    });

    expect(component.success()).toBeTrue();
  });

  it('should log error when registration fails', async () => {
    component.registrationToken = 'valid-token';
    component.form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'ValidPassword123'
    });

    const testError = new Error('Test error');
    mockStateService.completeRegistration.and.throwError(testError);
    spyOn(console, 'error');

    await component.submit();

    expect(console.error).toHaveBeenCalledWith('Registration error:', testError);
  });

  it('should open and close login modal', () => {
    expect(component.showLoginModal).toBeFalse();
    component.openLoginModal();
    expect(component.showLoginModal).toBeTrue();
    component.closeLoginModal();
    expect(component.showLoginModal).toBeFalse();
  });
});
