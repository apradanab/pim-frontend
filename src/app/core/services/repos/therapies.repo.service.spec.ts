import { TestBed } from '@angular/core/testing';
import { TherapiesRepoService } from './therapies.repo.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Therapy } from '../../../models/therapy.model';
import { environment } from '../../../../environments/environment.development';

describe('TherapiesRepoService', () => {
  let service: TherapiesRepoService;
  let httpTestingController: HttpTestingController;

  const mockTherapies: Therapy[] = [
    {
      therapyId: '1',
      title: 'Terapia 1',
      description: 'Descripción 1',
      content: 'Contenido 1',
      maxParticipants: 1,
      image: {
        key: 'test-key',
        url: 'http://test.com'
      },
      createdAt: '2024-01-01T00:00:00.000Z',
    }
  ];

  const newTherapy: Therapy = {
    therapyId: '2',
    title: 'Nueva Terapia',
    description: 'Nueva Descripción',
    content: 'Nuevo Contenido',
    maxParticipants: 5,
    image: {
      key: 'test-key',
      url: 'http://test.com'
    },
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TherapiesRepoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all therapies', () => {
    service.listTherapies().subscribe(therapies => {
      expect(therapies).toEqual(mockTherapies);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/therapies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTherapies);
  });

  it('should get therapy by id', () => {
    const therapyId = '1';
    service.getTherapy(therapyId).subscribe(therapy => {
      expect(therapy).toEqual(mockTherapies[0]);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/therapies/${therapyId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTherapies[0]);
  });

  it('should create a new therapy', () => {
    service.createTherapy(newTherapy).subscribe(therapy => {
      expect(therapy).toEqual(newTherapy);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/therapies`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTherapy);
    req.flush(newTherapy);
  });

  it('should update a therapy', () => {
    const therapyId = '1';
    const updatedData = { title: 'Terapia Actualizada' };

    service.updateTherapy(therapyId, updatedData).subscribe(therapy => {
      expect(therapy.title).toBe('Terapia Actualizada');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/therapies/${therapyId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedData);
    req.flush({...mockTherapies[0], ...updatedData});
  });

  it('should delete a therapy', () => {
    const therapyId = '1';

    service.deleteTherapy(therapyId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/therapies/${therapyId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
