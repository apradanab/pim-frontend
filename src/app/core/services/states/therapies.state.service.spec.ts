import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TherapiesStateService } from './therapies.state.service';
import { TherapiesRepoService } from '../repos/therapies.repo.service';
import { Therapy } from '../../../models/therapy.model';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../interceptors/error.interceptor';

describe('TherapiesStateService', () => {
  let service: TherapiesStateService;
  let mockRepo: jasmine.SpyObj<TherapiesRepoService>;

  const mockTherapy: Therapy = {
    therapyId: '1',
    title: 'Test therapy',
    description: 'Test description',
    content: 'Test content',
    maxParticipants: 1,
    image: {
      key: 'test-key',
      url: 'http://test.com'
    },
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('TherapiesRepoService', [
      'listTherapies',
      'getTherapy',
      'createTherapy',
      'updateTherapy',
      'deleteTherapy'
    ]);

    spyOn(console, 'error');

    TestBed.configureTestingModule({
      providers: [
        TherapiesStateService,
        { provide: TherapiesRepoService, useValue: mockRepo }
      ]
    });

    service = TestBed.inject(TherapiesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listTherapies', () => {
    it('should list all therapies', fakeAsync(() => {
      mockRepo.listTherapies.and.returnValue(of([mockTherapy]));

      service.listTherapies();
      tick();

      const state = service.therapiesState();
      expect(state.list.length).toBe(1);
      expect(state.list[0]).toEqual(mockTherapy);
    }));

    it('should handle loading error', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Internal server error'};
      mockRepo.listTherapies.and.returnValue(throwError(() => error));

      service.listTherapies();
      tick();

      const state = service.therapiesState();
      expect(state.list).toEqual([]);
      expect(state.error).toBe('Internal server error');
    }));
  });

  describe('getTherapy', () => {
    it('should get therapy by id', fakeAsync(() => {
      mockRepo.getTherapy.and.returnValue(of(mockTherapy));

      service.getTherapy('1');
      tick();

      const state = service.therapiesState();
      expect(state.current).toEqual(mockTherapy);
    }));

    it('should handle error when getting therapy fails', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found'};
      mockRepo.getTherapy.and.returnValue(throwError(() => error));

      service.getTherapy('1');
      tick();

      const state = service.therapiesState();
      expect(state.current).toBeNull();
      expect(state.error).toBe('Not Found');
    }));
  });

  describe('createTherapy', () => {
    it('should create new therapy', fakeAsync(() => {
      const newTherapy: Therapy = { ...mockTherapy, therapyId: '2' };
      mockRepo.createTherapy.and.returnValue(of(newTherapy));

      service.createTherapy(newTherapy);
      tick();

      const state = service.therapiesState();
      expect(state.list).toContain(newTherapy);
    }));

    it('should handle error when creating therapy', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockRepo.createTherapy.and.returnValue(throwError(() => error));

      service.createTherapy(mockTherapy);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating therapy:', 'Bad Request');
    }));
  });

  describe('updateTherapy', () => {
    it('should correctly update the specific therapy in list and set as current', fakeAsync(() => {
      const initialTherapy1 = { ...mockTherapy, therapyId: '1', title: 'Title 1'};
      const initialTherapy2 = { ...mockTherapy, therapyId: '2', title: 'Title 2'};
      const updatedTherapy = { ...mockTherapy, therapyId: '1', title: 'Updated title'};

      mockRepo.listTherapies.and.returnValue(of([initialTherapy1, initialTherapy2]));
      service.listTherapies();
      tick();

      mockRepo.updateTherapy.and.returnValue(of(updatedTherapy));
      service.updateTherapy('1', { title: 'Updated title' });
      tick();

      const state = service.therapiesState();
      const updated = state.list.find(i => i.therapyId === '1');
      const unchanged = state.list.find(i => i.therapyId === '2');

      expect(state.list.length).toBe(2);
      expect(updated?.title).toBe('Updated title');
      expect(unchanged?.title).toBe('Title 2');
      expect(state.current).toEqual(updatedTherapy)
    }));

    it('should handle error when updating therapy', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockRepo.updateTherapy.and.returnValue(throwError(() => error));

      service.updateTherapy('1', { title: 'Updated title' });
      tick();

      expect(console.error).toHaveBeenCalledWith('Error updating therapy:', 'Not Found');
    }));
  });

  describe('deleteTherapy', () => {
    it('should delete therapy', fakeAsync(() => {
      mockRepo.listTherapies.and.returnValue(of([mockTherapy]));
      service.listTherapies();
      tick();

      mockRepo.deleteTherapy.and.returnValue(of(undefined));

      service.deleteTherapy('1');
      tick();

      const state = service.therapiesState();
      expect(state.list).toEqual([]);
      expect(state.current).toBeNull();
    }));

    it('should handle error when deleting therapy', fakeAsync(() => {
      const error: ApiError = { status: 403, message: 'Forbidden' };
      mockRepo.deleteTherapy.and.returnValue(throwError(() => error));

      service.deleteTherapy('1');
      tick();
      expect(console.error).toHaveBeenCalledWith('Error deleting therapy:', 'Forbidden');
    }))
  })
});
