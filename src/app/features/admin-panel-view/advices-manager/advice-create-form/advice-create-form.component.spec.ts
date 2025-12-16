import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdviceCreateFormComponent } from './advice-create-form.component';
import { of } from 'rxjs';
import { Therapy } from '../../../../models/therapy.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdvicesStateService } from '../../../../core/services/states/advices.state.service';
import { MediaService } from '../../../../core/services/utils/media.service';
import { AdviceInput } from '../../../../models/advice.model';

class MockAdvicesStateService {
  private state = {
    list: [],
    isLoading: false,
    error: null,
    current: null
  };

  advicesState = () => this.state;

  createAdvice = jasmine.createSpy('createAdvice').and.returnValue(Promise.resolve());

  setState(newState: Partial<typeof this.state>) {
    this.state = { ...this.state, ...newState };
  }
}

class MockMediaService {
  generateUploadUrl = jasmine.createSpy('generateUploadUrl').and.returnValue(
    of({ uploadUrl: 'https://upload.url', key: 'image-key' })
  );
  uploadFile = jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve());
  getImageUrl = jasmine.createSpy('getImageUrl').and.callFake((key: string, folder?: string) =>
    `https://cdn/${folder}/${key}`
  );
}

describe('AdviceCreateFormComponent', () => {
  let component: AdviceCreateFormComponent;
  let fixture: ComponentFixture<AdviceCreateFormComponent>;
  let stateService: MockAdvicesStateService;
  let mediaService: MockMediaService;

  const mockTherapies: Therapy[] = [
    { therapyId: 't1', title: 'Terapia Uno', description: '', content: '', maxParticipants: 1, createdAt: '' },
    { therapyId: 't2', title: 'Terapia Dos', description: '', content: '', maxParticipants: 1, createdAt: '' },
  ];

  let mockFileReader: jasmine.SpyObj<FileReader>;

  beforeEach(async () => {
    mockFileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window, 'FileReader' as keyof Window).and.returnValue(mockFileReader);

    await TestBed.configureTestingModule({
      imports: [AdviceCreateFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AdvicesStateService, useClass: MockAdvicesStateService },
        { provide: MediaService, useClass: MockMediaService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdviceCreateFormComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(AdvicesStateService) as unknown as MockAdvicesStateService;
    mediaService = TestBed.inject(MediaService) as unknown as MockMediaService;

    fixture.componentRef.setInput('availableTherapies', mockTherapies);

    fixture.detectChanges();
    await fixture.whenStable();

    component.adviceForm.setValue({
      therapyId: mockTherapies[0].therapyId,
      title: 'Nuevo título',
      description: 'Nueva descripción',
      content: 'Contenido completo',
    })
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return an empty AdviceInput when calling getCurrentItem', () => {
    const item = component.getCurrentItem();
    expect(item).toEqual({} as AdviceInput);
  });

  it('should not call createAdvice if form is invalid', async () => {
    component.adviceForm.get('title')?.setValue('');

    await component.submit();

    expect(stateService.createAdvice).not.toHaveBeenCalled();
  })

  it('should call createAdvice, emit event, and reset form on successful submission without image', fakeAsync(async () => {
    spyOn(component.adviceCreated, 'emit');
    spyOn(component.adviceForm, 'reset').and.callThrough();

    component.file.set(null);

    await component.submit();
    tick();

    const expectedPayload = {
      therapyId: mockTherapies[0].therapyId,
      title: 'Nuevo título',
      description: 'Nueva descripción',
      content: 'Contenido completo',
      imageKey: undefined
    };

    expect(stateService.createAdvice).toHaveBeenCalledWith(expectedPayload);
    expect(component.adviceCreated.emit).toHaveBeenCalled();
    expect(component.adviceForm.reset).toHaveBeenCalled();
    expect(component.adviceForm.get('therapyId')?.value).toBe('');
    expect(component.file()).toBeNull();
    expect(component.previewUrl()).toBeUndefined();
  }));

  it('should call createAdvice, emit event, reset form, and reset image signals on success WITH image upload', fakeAsync(async () => {
    spyOn(component.adviceCreated, 'emit');
    spyOn(component.adviceForm, 'reset').and.callThrough();

    const file = new File(['data'], 'upload.png', { type: 'image/png' });
    component.file.set(file);
    component.previewUrl.set('mocked-url-preview');

    await component.submit();
    tick();
    tick();

    expect(mediaService.generateUploadUrl).toHaveBeenCalledWith('advice', jasmine.any(String), file.type);
    expect(mediaService.uploadFile).toHaveBeenCalled();

    const expectedPayload = {
      therapyId: mockTherapies[0].therapyId,
      title: 'Nuevo título',
      description: 'Nueva descripción',
      content: 'Contenido completo',
      imageKey: 'image-key'
    };

    expect(stateService.createAdvice).toHaveBeenCalledWith(expectedPayload);

    expect(component.adviceCreated.emit).toHaveBeenCalled();
    expect(component.adviceForm.reset).toHaveBeenCalled();
    expect(component.adviceForm.get('therapyId')?.value).toBe('');
    expect(component.file()).toBeNull();
    expect(component.previewUrl()).toBeUndefined();
  }));
});
