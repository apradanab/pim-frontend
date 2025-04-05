import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../models/service.model';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('StateService', () => {
  let service: StateService;
  let mockRepo: jasmine.SpyObj<ServicesRepoService>;

  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Terapia 1',
      description: 'Descripción 1',
      content: 'Contenido 1',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const newService: Service = {
    id: '2',
    title: 'Nueva Terapia',
    description: 'Nueva Descripción',
    content: 'Nuevo Contenido',
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIA5qKO1AAAAABJRU5ErkJggg==',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('ServicesRepoService', [
      'getServices',
      'getServiceById',
      'createService',
      'updateService',
      'deleteService'
    ]);

    mockRepo.getServices.and.returnValue(of(mockServices));
    mockRepo.getServiceById.and.returnValue(of(mockServices[0]));
    mockRepo.createService.and.returnValue(of(newService));
    mockRepo.updateService.and.returnValue(of({...mockServices[0], title: 'Updated'}));
    mockRepo.deleteService.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        StateService,
        { provide: ServicesRepoService, useValue: mockRepo }
      ]
    });
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty state', () => {
    const initialState = service.state$();
    expect(initialState.services).toEqual([]);
    expect(initialState.currentService).toBeNull();
  });

  it('should load services and update state', () => {
    service.loadServices();
    expect(mockRepo.getServices).toHaveBeenCalled();

    const state = service.state$();
    expect(state.services).toEqual(mockServices);
    expect(state.currentService).toBeNull();
  });

  it('should load service by id and update state', () => {
    service.loadServiceById('1');
    expect(mockRepo.getServiceById).toHaveBeenCalledWith('1');

    const state = service.state$();
    expect(state.currentService).toEqual(mockServices[0]);
  });

  it('should create a service and update state', (done) => {
    service.createService(newService).pipe(take(1)).subscribe(() => {
      const state = service.state$();
      expect(state.services).toContain(newService);
      done();
    });
  });

  it('should update a service and update state', (done) => {
    service.loadServices();

    const updatedData = { title: 'Updated' };

    service.updateService('1', updatedData).pipe(take(1)).subscribe(() => {
      const state = service.state$();
      expect(state.services[0].title).toBe('Updated');
      expect(state.currentService?.title).toBe('Updated');
      done();
    });

    mockRepo.updateService.and.returnValue(of({...mockServices[0], ...updatedData}));
  });

  it('should delete a service and update state', (done) => {
    service.loadServices();

    service.deleteService('1').pipe(take(1)).subscribe(() => {
      const state = service.state$();
      expect(state.services.length).toBe(0);
      expect(state.currentService).toBeNull();
      done();
    });
  });
});
