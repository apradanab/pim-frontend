import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TherapyEditFormComponent } from './therapy-edit-form.component';
import { Therapy } from '../../../../models/therapy.model';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MediaService } from '../../../../core/services/utils/media.service';

class MockMediaService {
  generateUploadUrl = jasmine.createSpy('generateUploadUrl').and.returnValue(
    of({ uploadUrl: 'https://upload.url', key: 'image-key' })
  );
  uploadFile = jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve());
  getImageUrl = jasmine.createSpy('getImageUrl').and.callFake((key: string, folder?: string) =>
    folder ? `https://cdn/${folder}/${key}` : `https//cdn/${key}`);
}

describe('TherapyEditFormComponent', () => {
  let component: TherapyEditFormComponent;
  let fixture: ComponentFixture<TherapyEditFormComponent>;
  let mediaService: MockMediaService;

  const mockTherapy: Therapy = {
    therapyId: '1',
    title: 'Terapia',
    description: 'Descripcion',
    content: 'Contenido',
    maxParticipants: 2,
    image: { key: 'img1', url: 'image.jpg' },
    bgColor: '#ccc',
    createdAt: '2025-01-01'
  };

  let mockFileReader: jasmine.SpyObj<FileReader>;

  beforeEach(async () => {
    mockFileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader' as keyof Window).and.returnValue(mockFileReader);

    await TestBed.configureTestingModule({
      imports: [TherapyEditFormComponent],
      providers: [
        FormBuilder,
        { provide: MediaService, useClass: MockMediaService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapyEditFormComponent);
    component = fixture.componentInstance;
    mediaService = TestBed.inject(MediaService) as unknown as MockMediaService;

    fixture.componentRef.setInput('therapy', mockTherapy);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and signals from therapy input', () => {
    const formValue = component.therapyForm.getRawValue();
    expect(formValue.title).toBe(mockTherapy.title);
    expect(formValue.description).toBe(mockTherapy.description);
    expect(component.previewUrl()).toBe(mockTherapy.image?.url);
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

  it('should return the current therapy item when calling getCurrentItem', () => {
    const currentItem = component.getCurrentItem();

    expect(currentItem).toBe(mockTherapy);
    expect(currentItem.therapyId).toBe('1');
  })

  it('should upload file and emit updated therapy on submit', async () => {
    spyOn(component.update, 'emit');
    const file = new File(['data'], 'upload.png', { type: 'image/png' });
    component.file.set(file);

    await component.submit();

    expect(mediaService.generateUploadUrl).toHaveBeenCalledWith('therapy', mockTherapy.therapyId, file.type);
    expect(mediaService.uploadFile).toHaveBeenCalled();
    expect(mediaService.getImageUrl).toHaveBeenCalledWith('image-key', 'therapy');
    expect(component.update.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      image: { key: 'image-key', url: 'https://cdn/therapy/image-key' }
    }));
  });

  it('should emit updated therapy with undefined image when therapy has no image and no file', async () => {
    spyOn(component.update, 'emit');

    fixture.componentRef.setInput('therapy', {
      ...mockTherapy,
      image: undefined
    });

    component.file.set(null);

    await component.submit();

    expect(component.update.emit).toHaveBeenCalledWith({
      ...mockTherapy,
      image: undefined,
      title: component.therapyForm.value.title!,
      description: component.therapyForm.value.description!,
      content: component.therapyForm.value.content!,
      maxParticipants: component.therapyForm.value.maxParticipants!,
      bgColor: component.therapyForm.value.bgColor!,
    });
  });

  it('should not submit if form is invalid', async () => {
    spyOn(component.update, 'emit');
    component.therapyForm.get('title')?.setValue('');
    await component.submit();
    expect(component.update.emit).not.toHaveBeenCalled();
  });

  it('should log error if mediaService fails', async () => {
    spyOn(console, 'error');
    const file = new File(['data'], 'fail.png', { type: 'image/png' });
    component.file.set(file);

    mediaService.generateUploadUrl = jasmine.createSpy().and.returnValue(of(Promise.reject('error')));
    await component.submit();
    expect(console.error).toHaveBeenCalledWith('Error uploading image for therapy:', jasmine.anything());
  });
});
