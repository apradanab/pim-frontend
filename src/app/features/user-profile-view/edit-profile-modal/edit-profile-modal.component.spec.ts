import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EditProfileModalComponent } from './edit-profile-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { MediaService } from '../../../core/services/utils/media.service';
import { User } from '../../../models/user.model';

class MockUsersStateService {
  usersState = signal({
    currentUser: {
      userId: '123',
      name: 'Alice',
      email: 'alice@example.com',
      avatar: {
        key: 'avatar-key',
        url: 'avatar.jpg'
      },
      role: 'USER',
      approved: true
    } as User,
  });

  updateUserProfile = jasmine.createSpy('updateUserProfile').and.returnValue(Promise.resolve());
}

class MockMediaService {
  generateUploadUrl = jasmine.createSpy('generateUploadUrl').and.returnValue(
    of({ uploadUrl: 'https://upload.url', key: 'avatar-key' })
  );
  uploadFile = jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve());
  getImageUrl = jasmine.createSpy('getImageUrl').and.callFake((key: string, folder?: string) =>
  folder ? `https://cdn/${folder}/${key}` : `https://cdn/${key}`)
}


describe('EditProfileModalComponent', () => {
  let component: EditProfileModalComponent;
  let fixture: ComponentFixture<EditProfileModalComponent>;
  let usersState: MockUsersStateService;
  let mediaService: MockMediaService;
  let mockFileReader: jasmine.SpyObj<FileReader>;

  beforeEach(async () => {
    mockFileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader' as keyof Window).and.returnValue(mockFileReader);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditProfileModalComponent],
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: UsersStateService, useClass: MockUsersStateService },
        { provide: MediaService, useClass: MockMediaService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileModalComponent);
    component = fixture.componentInstance;
    usersState = TestBed.inject(UsersStateService) as unknown as MockUsersStateService;
    mediaService = TestBed.inject(MediaService) as unknown as MockMediaService;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with current user data', async () => {
    const user = usersState.usersState().currentUser;
    expect(component.form.value.name).toBe(user.name);
    expect(component.form.value.email).toBe(user.email);
  });

  it('should toggle password fields visibility', () => {
    const initial = component.showPasswordFields();
    component.togglePasswordFields();
    expect(component.showPasswordFields()).toBe(!initial);
  });

  it('should close modal and emit event', () => {
    spyOn(component.modalClosed, 'emit');
    component.closeModal();
    expect(component.showModal()).toBeFalse();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it('should call updateUserProfile without avatar or passwords', async () => {
    usersState.usersState.set({
      currentUser: {
        userId: '123',
        name: 'Alice',
        email: 'alice@example.com',
        role:'USER',
        approved: true
      } as User,
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const user = usersState.usersState().currentUser;
    component.form.setValue({
      name: 'Updated Name',
      email: 'updated@example.com',
      currentPassword: '',
      newPassword: '',
    });

    await component.submit();

    expect(usersState.updateUserProfile).toHaveBeenCalledWith(user.userId, {
      name: 'Updated Name',
      email: 'updated@example.com',
    });
  });

  it('should call mediaService and include avatarKey if file exists', async () => {
    const user = usersState.usersState().currentUser;
    const file = new File(['dummy'], 'avatar.jpg', { type: 'image/jpeg' });
    component.file.set(file);

    component.form.setValue({
      name: 'Alice',
      email: 'alice@example.com',
      currentPassword: '',
      newPassword: '',
    });

    await component.submit();

    expect(mediaService.generateUploadUrl).toHaveBeenCalled();
    expect(mediaService.uploadFile).toHaveBeenCalled();
    expect(usersState.updateUserProfile).toHaveBeenCalledWith(user.userId, {
      name: 'Alice',
      email: 'alice@example.com',
      avatarKey: 'avatar-key',
    });
  });

  it('should include passwords in payload if showPasswordFields is true', async () => {
    usersState.usersState.set({
      currentUser: {
        userId: '123',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'USER',
        approved: true
      } as User,
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const user = usersState.usersState().currentUser;
    component.showPasswordFields.set(true);
    component.form.setValue({
      name: 'Alice',
      email: 'alice@example.com',
      currentPassword: 'oldpass',
      newPassword: 'newpass',
    });

    await component.submit();

    expect(usersState.updateUserProfile).toHaveBeenCalledWith(user.userId, {
      name: 'Alice',
      email: 'alice@example.com',
      currentPassword: 'oldpass',
      password: 'newpass',
    });
  });

  it('should not call updateUserProfile when form is invalid', async () => {
    component.form.setValue({
      name: '',
      email: 'invalid',
      currentPassword: '',
      newPassword: '',
    });

    await component.submit();

    expect(usersState.updateUserProfile).not.toHaveBeenCalled();
  });

  it('should log error if updateUserProfile throws', async () => {
    const consoleSpy = spyOn(console, 'error');
    usersState.updateUserProfile.and.returnValue(Promise.reject('update failed'));

    component.form.setValue({
      name: 'Error User',
      email: 'error@example.com',
      currentPassword: '',
      newPassword: '',
    });

    await component.submit();

    expect(consoleSpy).toHaveBeenCalledWith('Error updating profile:', 'update failed');
  });

  it('should handle file change, set file, and update previewUrl', fakeAsync(() => {
    const testFile = new File(['file content'], 'test.png', { type: 'image/png' });
    const mockEvent = {
    target: {
      files: [testFile],
      length: 1
    }
    } as unknown as Event;

    const readerResult = 'data:image/png;base64,mocked';

    Object.defineProperty(mockFileReader, 'result', {
      writable: true,
      value: readerResult
    });

    component.handleFileChange(mockEvent);

    expect(component.file()).toBe(testFile);
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(testFile);

    (mockFileReader.onload as jasmine.Spy).call(mockFileReader);
    tick();

    expect(component.previewUrl()).toBe(readerResult);
  }));

  it('should correctly implement BaseEDitForm getters', () => {
    expect(component.getForm()).toBe(component.form);

    const currentUser = usersState.usersState().currentUser!;

    expect(component.getCurrentItem()).toBe(currentUser);
    expect(component.getItemId()).toBe(currentUser.userId);
    expect(component.getUploadFolder()).toBe('avatar');
    expect(component.getCurrentImageKey()).toBe(currentUser.avatar!.key);

    const builtItem = component.buildUpdatedItem({}, undefined);
    expect(builtItem).toBe(currentUser);

  });
});
