import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdviceEditFormComponent } from './advice-edit-form.component';
import { Advice } from '../../../../models/advice.model';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MediaService } from '../../../../core/services/utils/media.service';

class MockMediaService {
  generateUploadUrl = jasmine.createSpy('generateUploadUrl').and.returnValue(
    of({ uploadUrl: 'https://upload.url', key: 'image-key' })
  );
  uploadFile = jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve());
  getImageUrl = jasmine.createSpy('getImageUrl').and.callFake((key: string, folder?: string) =>
    `https://cdn/${folder}/${key}`
  );
}

describe('AdviceEditFormComponent', () => {
  let component: AdviceEditFormComponent;
  let fixture: ComponentFixture<AdviceEditFormComponent>;
  let mediaService: MockMediaService;

  const mockAdvice: Advice = {
    adviceId: 'a1',
    therapyId: 't1',
    title: 'Consejo',
    description: 'Descripcion',
    content: 'Contenido',
    image: { key: 'img1', url: 'image.jpg' },
    createdAt: '2025-01-01'
  };

  let mockFileReader: jasmine.SpyObj<FileReader>;

  beforeEach(async () => {
    mockFileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader' as keyof Window).and.returnValue(mockFileReader);

    await TestBed.configureTestingModule({
      imports: [AdviceEditFormComponent],
      providers: [
        FormBuilder,
        { provide: MediaService, useClass: MockMediaService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdviceEditFormComponent);
    component = fixture.componentInstance;
    mediaService = TestBed.inject(MediaService) as unknown as MockMediaService;

    fixture.componentRef.setInput('advice', mockAdvice);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and signals from advice input', () => {
    const formValue = component.adviceForm.getRawValue();
    expect(formValue.title).toBe(mockAdvice.title);
    expect(formValue.description).toBe(mockAdvice.description);
    expect(formValue.content).toBe(mockAdvice.content);
    expect(component.previewUrl()).toBe(mockAdvice.image?.url);
    expect(component.file()).toBeNull();
  });

  it('should handle file change and update previewUrl', fakeAsync(() => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    const readerResult = 'data:image/png;base64,mocked';
    Object.defineProperty(mockFileReader, 'result', { writable: true, value: readerResult });

    component.handleFileChange(event);
    expect(component.file()).toBe(file);
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);

    (mockFileReader.onload as jasmine.Spy).call(mockFileReader);
    tick();
    expect(component.previewUrl()).toBe(readerResult);
  }));

  it('should return the current advice item when calling getCurrentItem', () => {
    const currentItem = component.getCurrentItem();

    expect(currentItem).toBe(mockAdvice);
    expect(currentItem.adviceId).toBe('a1');
  })

  it('should upload file and emit updated advice on submit', async () => {
    spyOn(component.update, 'emit');
    const file = new File(['data'], 'upload.png', { type: 'image/png' });
    component.file.set(file);

    await component.submit();

    expect(mediaService.generateUploadUrl).toHaveBeenCalledWith('advice', mockAdvice.adviceId, file.type);
    expect(mediaService.uploadFile).toHaveBeenCalled();
    expect(mediaService.getImageUrl).toHaveBeenCalledWith('image-key', 'advice');
    expect(component.update.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      image: { key: 'image-key', url: 'https://cdn/advice/image-key' }
    }));
  });

  it('should emit updated advice with undefined image when advice has no image and no file', async () => {
    spyOn(component.update, 'emit');

    fixture.componentRef.setInput('advice', {
      ...mockAdvice,
      image: undefined
    });

    fixture.detectChanges();
    component.file.set(null);

    await component.submit();

    expect(component.update.emit).toHaveBeenCalledWith({
      ...mockAdvice,
      image: undefined as unknown as Advice['image'],
      title: component.adviceForm.value.title!,
      description: component.adviceForm.value.description!,
      content: component.adviceForm.value.content!,
    });
  });

  it('should not submit if form is invalid', async () => {
    spyOn(component.update, 'emit');
    component.adviceForm.get('title')?.setValue('');
    await component.submit();
    expect(component.update.emit).not.toHaveBeenCalled();
  });

  it('should log error if mediaService fails', async () => {
    spyOn(console, 'error');
    const file = new File(['data'], 'fail.png', { type: 'image/png' });
    component.file.set(file);

    mediaService.generateUploadUrl = jasmine.createSpy().and.returnValue(of(Promise.reject('error')));
    await component.submit();
    expect(console.error).toHaveBeenCalledWith('Error uploading image for advice:', jasmine.anything());
  });
});
