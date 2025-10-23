import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginModalComponent } from './login-modal.component';
import { AuthStateService } from '../../../core/services/states/auth.state.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let stateServiceMock: jasmine.SpyObj<AuthStateService>;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginModalComponent,
        ReactiveFormsModule,
        FontAwesomeModule
      ],
      providers: [
        { provide: AuthStateService, useValue: stateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login when form is valid', () => {
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123'
    });
    component.onSubmit();
    expect(stateServiceMock.login).toHaveBeenCalled();
  });
});
