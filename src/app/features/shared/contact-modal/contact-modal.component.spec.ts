import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactModalComponent } from './contact-modal.component';
import { UsersRepoService } from '../../../core/services/repos/users.repo.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { User } from '../../../models/user.model';
import { ApiError } from '../../../core/interceptors/error.interceptor';

describe('ContactModalComponent', () => {
  let component: ContactModalComponent;
  let fixture: ComponentFixture<ContactModalComponent>;
  let usersRepoMock: jasmine.SpyObj<UsersRepoService>;

  beforeEach(async () => {
    usersRepoMock = jasmine.createSpyObj<UsersRepoService>('UsersRepoService',
      ['preregister', 'login', 'updateUser', 'getById']);

    usersRepoMock.preregister.and.returnValue(of({} as User));

    await TestBed.configureTestingModule({
      imports: [
        ContactModalComponent,
        ReactiveFormsModule,
        FontAwesomeModule
      ],
      providers: [
        { provide: UsersRepoService, useValue: usersRepoMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.contactForm.value).toEqual({
      name: '',
      email: '',
      message: '',
      privacyPolicy: false
    });
  });

  it('should call preregister and close modal when form is valid', () => {
    const testData = {
      name: 'Test User',
      email: 'valid@email.com',
      message: 'This is a valid message with more than 10 chars',
      privacyPolicy: true
    };

    component.contactForm.setValue(testData);
    spyOn(component, 'closeModal');

    component.onSubmit();

    expect(usersRepoMock.preregister).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        name: testData.name,
        email: testData.email,
        message: testData.message
      })
    );
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should handle error when preregister fails', () => {
    const testData = {
      name: 'Test User',
      email: 'valid@email.com',
      message: 'This is a valid message',
      privacyPolicy: true
    };

    const mockError: ApiError = {
      status: 400,
      message: 'Bad Request'
    };

    component.contactForm.setValue(testData);
    usersRepoMock.preregister.and.returnValue(throwError(() => mockError));

    component.onSubmit();

    expect(component.error).toEqual(mockError);
  });

  it('should emit modalClosed event', () => {
    spyOn(component.modalClosed, 'emit');
    component.closeModal();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it('should toggle privacy policy visibility', () => {
    expect(component.showPrivacy).toBeFalse();

    component.showPrivacyPolicy(new Event('click'));
    expect(component.showPrivacy).toBeTrue();

    component.hidePrivacyPolicy();
    expect(component.showPrivacy).toBeFalse();
  });
});
