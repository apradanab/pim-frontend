import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../models/service.model';
import { of, throwError } from 'rxjs';
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
      image: 'data:image/png;base64,...',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const newService: Service = {
    id: '2',
    title: 'Nueva Terapia',
    description: 'Nueva Descripción',
    content: 'Nuevo Contenido',
    image: 'data:image/png;base64,...',
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
    const state = service.state$();
    expect(state.services).toEqual([]);
    expect(state.currentService).toBeNull();
  });

  describe('loadServices', () => {
    it('should load services and update state', () => {
      service.loadServices();
      const state = service.state$();
      expect(state.services).toEqual(mockServices);
    });

    it('should set empty array on error', () => {
      mockRepo.getServices.and.returnValue(throwError(() => new Error('Error')));
      service.loadServices();
      const state = service.state$();
      expect(state.services).toEqual([]);
    });
  });

  describe('loadServiceById', () => {
    it('should load service and update currentService', () => {
      service.loadServiceById('1');
      const state = service.state$();
      expect(state.currentService).toEqual(mockServices[0]);
    });

    it('should set currentService to null on error', () => {
      mockRepo.getServiceById.and.returnValue(throwError(() => new Error('Error')));
      service.loadServiceById('1');
      const state = service.state$();
      expect(state.currentService).toBeNull();
    });
  });

  describe('createService', () => {
    it('should add new service to state', (done) => {
      service.createService(newService).pipe(take(1)).subscribe(() => {
        const state = service.state$();
        expect(state.services).toContain(newService);
        done();
      });
    });
  });

  describe('updateService', () => {
    const multipleMockServices: Service[] = [
      {
        id: '1',
        title: 'Terapia 1',
        description: 'Descripción 1',
        content: 'Contenido 1',
        image: 'data:image/png;base64,...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Terapia 2',
        description: 'Descripción 2',
        content: 'Contenido 2',
        image: 'data:image/png;base64,...',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    beforeEach(() => {
      mockRepo.getServices.and.returnValue(of([...multipleMockServices]));
      service.loadServices();
    });

    it('should update the correct service and leave others unchanged', (done) => {
      const updatedData = { title: 'Updated' };
      const originalService2 = {...multipleMockServices[1]};

      const updatedServiceMock = {
        ...multipleMockServices[0],
        ...updatedData
      };
      mockRepo.updateService.and.returnValue(of(updatedServiceMock));

      service.updateService('1', updatedData).pipe(take(1)).subscribe(() => {
        const state = service.state$();

        const updatedService = state.services.find(s => s.id === '1');
        expect(updatedService).toBeDefined();
        expect(updatedService?.title).toBe('Updated');

        const unchangedService = state.services.find(s => s.id === '2');
        expect(unchangedService).toEqual(originalService2);

        expect(state.currentService).toEqual(updatedServiceMock);
        done();
      });
    });

    it('should not modify state if service id is not found', (done) => {
      const originalState = service.state$();

      mockRepo.updateService.and.returnValue(throwError(() => new Error('Not found')));

      service.updateService('99', { title: 'Updated' }).pipe(take(1)).subscribe({
        error: () => {
          const newState = service.state$();
          expect(newState).toEqual(originalState);
          done();
        }
      });
    });
  });

  describe('deleteService', () => {
    beforeEach(() => {
      service.loadServices();
    });

    it('should remove service from state', (done) => {
      service.deleteService('1').pipe(take(1)).subscribe(() => {
        const state = service.state$();
        expect(state.services.length).toBe(0);
        expect(state.currentService).toBeNull();
        done();
      });
    });
  });
});
