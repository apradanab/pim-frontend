import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MediaService } from '../../../core/services/utils/media.service';
import { BaseEditForm } from './base-edit-form';
import { EditableItem, ImageInfo, UploadFolder } from '../../../models/form.model';

class MockMediaService {
  generateUploadUrl = jasmine.createSpy('generateUploadUrl').and.returnValue(
    of({ uploadUrl: 'https://upload.url/presigned', key: 'new-key' })
  );
  uploadFile = jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve());
  getImageUrl = jasmine.createSpy('getImageUrl').and.callFake((key: string, folder?: UploadFolder) =>
    `https://cdn/${folder}/${key}`
  );
}

interface MockEditItem extends EditableItem {
  id: string;
  title: string;
  imageKey?: string;
}

class MockBaseEditForm extends BaseEditForm<MockEditItem> {
  private item: MockEditItem = { id: 'mock-id-1', title: 'Initial Title', imageKey: 'old-key' };
  private form: FormGroup = new FormGroup({
    title: new FormControl(this.item.title, Validators.required)
  });

  getForm(): FormGroup { return this.form }
  getCurrentItem(): MockEditItem { return this.item; }
  getItemId(): string { return this.item.id; }
  getUploadFolder(): 'advice' { return 'advice'; }
  getCurrentImageKey(): string | undefined { return this.item.imageKey; }

  buildUpdatedItem(formValue: object, image: ImageInfo | undefined): MockEditItem {
    return { ...this.item, ...(formValue as Partial<MockEditItem>), imageKey: image?.key };
  }
}

describe('BaseEditForm', () => {
  let component: MockBaseEditForm;
  let mediaService: MockMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MediaService, useClass: MockMediaService },
      ],
    });

    component = TestBed.runInInjectionContext(() => new MockBaseEditForm());
    mediaService = TestBed.inject(MediaService) as unknown as MockMediaService;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should upload file and return updated item', async () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    component.file.set(file);

    const updatedItem = await component.submitBase();

    expect(mediaService.generateUploadUrl).toHaveBeenCalled();
    expect(mediaService.uploadFile).toHaveBeenCalled();
    expect(mediaService.getImageUrl).toHaveBeenCalled();
    expect(updatedItem?.imageKey).toBe('new-key');
  });

  it('should return item with existing key when no file', async () => {
    component.file.set(null);
    const updatedItem = await component.submitBase();

    expect(mediaService.generateUploadUrl).not.toHaveBeenCalled();
    expect(updatedItem?.imageKey).toBe('old-key');
  });

  it('should update file and previewUrl on handleFileChange', fakeAsync(() => {
    const mockFileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader' as keyof Window).and.returnValue(mockFileReader);
    const file = new File(['data'], 'img.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;

    Object.defineProperty(mockFileReader, 'result', { writable: true, value: 'data-url-mock' });
    component.handleFileChange(event);

    expect(component.file()).toBe(file);
    (mockFileReader.onload as jasmine.Spy).call(mockFileReader);
    tick();
    expect(component.previewUrl()).toBe('data-url-mock');
  }));

  it('should return null if image upload fails', async () => {
    spyOn(console, 'error');
    component.file.set(new File(['fail'], 'fail.png', { type: 'image/png' }));

    mediaService.generateUploadUrl = jasmine.createSpy().and.returnValue(
      throwError(() => new Error('Upload Failed'))
    );

    const updatedItem = await component.submitBase();

    expect(console.error).toHaveBeenCalled();
    expect(updatedItem).toBeNull();
  });

  it('should return null if form is invalid', async () => {
    component.getForm().get('title')?.setValue('');
    const updatedItem = await component.submitBase();
    expect(updatedItem).toBeNull();
    expect(mediaService.generateUploadUrl).not.toHaveBeenCalled();
  });
});
