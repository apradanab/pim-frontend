import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../models/service.model';
import { of, throwError } from 'rxjs';

describe('StateService', () => {
  let service: StateService;
  let mockRepo: jasmine.SpyObj<ServicesRepoService>;
  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Terapia 1',
      description: 'Descripción 1',
      content: 'Contenido 1',
      image: 'image1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('ServicesRepoService', ['getServices']);
    mockRepo.getServices.and.returnValue(of(mockServices));

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

  it('should load services and update signal', () => {
    service.loadServices();
    expect(mockRepo.getServices).toHaveBeenCalled();
    expect(service.services()).toEqual(mockServices);
  });

  it('should handle error when loading services', () => {
    const errorSpy = spyOn(console, 'error');
    const error = new Error('Test error');

    mockRepo.getServices.and.returnValue(throwError(() => error));

    service.loadServices();

    expect(mockRepo.getServices).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Error loading services:', error);
    expect(service.services()).toEqual([]);
  });
});
