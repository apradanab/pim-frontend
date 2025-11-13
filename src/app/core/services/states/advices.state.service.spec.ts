import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdvicesStateService } from './advices.state.service';
import { AdvicesRepoService } from '../repos/advices.repo.service';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../interceptors/error.interceptor';
import { Advice } from '../../../models/advice.model';

describe('AdvicesStateService', () => {
  let service: AdvicesStateService;
  let mockRepo: jasmine.SpyObj<AdvicesRepoService>;

  const mockAdvice: Advice = {
    adviceId: '1',
    therapyId: '1',
    title: 'Test Advice',
    description: 'Test Description',
    content: 'Test Content',
    image: {
      key: 'test-key',
      url: 'http://test.com'
    },
    createdAt: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('AdvicesRepoService', [
      'listAdvices',
      'getAdvice',
      'listAdvicesByTherapy',
      'createAdvice',
      'updateAdvice',
      'deleteAdvice'
    ]);

    spyOn(console, 'error');

    TestBed.configureTestingModule({
      providers: [
        AdvicesStateService,
        { provide: AdvicesRepoService, useValue: mockRepo }
      ]
    });

    service = TestBed.inject(AdvicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listAdvices', () => {
    it('should list all advices', fakeAsync(() => {
      mockRepo.listAdvices.and.returnValue(of([mockAdvice]));

      service.listAdvices();
      tick();

      const state = service.advicesState();
      expect(state.list.length).toBe(1);
      expect(state.list[0]).toEqual(mockAdvice);
    }));

    it('should handle error when list all advices', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Internal Server Error'};
      mockRepo.listAdvices.and.returnValue(throwError(() => error));

      service.listAdvices();
      tick();

      const state = service.advicesState();
      expect(state.list).toEqual([]);
      expect(state.error).toBe('Internal Server Error');
    }));
  });

  describe('getAdvice', () => {
    it('should get therapy by id', fakeAsync(() => {
      mockRepo.getAdvice.and.returnValue(of(mockAdvice));

      service.getAdvice('1');
      tick();

      const state = service.advicesState();
      expect(state.current).toEqual(mockAdvice);
    }));

    it('should handle error when getting therapy fails', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockRepo.getAdvice.and.returnValue(throwError(() => error));

      service.getAdvice('1');
      tick();

      const state = service.advicesState();
      expect(state.current).toBeNull();
      expect(state.error).toBe('Not Found');
    }));
  });

  describe('listAdvicesByTherapy', () => {
    it('should list advices by therapy id', fakeAsync(() => {
      mockRepo.listAdvicesByTherapy.and.returnValue(of([mockAdvice]));

      service.listAdvicesByTherapy('1');
      tick();

      const state = service.advicesState();
      expect(state.filtered.length).toBe(1);
      expect(state.filtered[0]).toEqual(mockAdvice);
    }));

    it('should handle error state when getting advices by therapy id fails', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockRepo.listAdvicesByTherapy.and.returnValue(throwError(() => error));

      service.listAdvicesByTherapy('1');
      tick();

      const state = service.advicesState();
      expect(state.filtered).toEqual([]);
      expect(state.error).toBe('Not Found');
    }));
  });

  describe('createAdvice', () => {
    it('should create new advice', fakeAsync(() => {
      const newAdvice: Advice = { ...mockAdvice, adviceId:'2' };
      mockRepo.createAdvice.and.returnValue(of(newAdvice));

      service.createAdvice(newAdvice);
      tick();

      expect(service.advicesState().list).toContain(newAdvice);
    }));

    it('should handle error when creating advice', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockRepo.createAdvice.and.returnValue(throwError(() => error));

      service.createAdvice(mockAdvice);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating advice:', 'Bad Request');
    }));
  });

  describe('updateAdvice', () => {
    it('should update an advice in list, filtered, and current', fakeAsync(() => {
      const newAdvice: Advice = { ...mockAdvice };
      mockRepo.createAdvice.and.returnValue(of(newAdvice));
      service.createAdvice(newAdvice);
      tick();

      const updatedAdvice: Advice = { ...mockAdvice, title: 'Updated Title' };
      mockRepo.updateAdvice.and.returnValue(of(updatedAdvice));

      service.updateAdvice('1', updatedAdvice);
      tick();

      const state = service.advicesState();
      expect(state.list[0].title).toBe('Updated Title');
      expect(state.current?.title).toBe('Updated Title');
    }));

    it('should update filtered advices as well', fakeAsync(() => {
      const newAdvice: Advice = { ...mockAdvice };
      const filteredAdvice: Advice = { ...mockAdvice, adviceId: '2' };

      mockRepo.createAdvice.and.returnValue(of(newAdvice));
      service.createAdvice(newAdvice);
      tick();

      mockRepo.listAdvicesByTherapy.and.returnValue(of([newAdvice, filteredAdvice]));
      service.listAdvicesByTherapy('1');
      tick();

      const updatedAdvice: Advice = { ...newAdvice, title: 'Updated Title' };
      mockRepo.updateAdvice.and.returnValue(of(updatedAdvice));
      service.updateAdvice('1', updatedAdvice);
      tick();

      const state = service.advicesState();
      expect(state.filtered.find(a => a.adviceId === '1')?.title).toBe('Updated Title');
    }));

    it('should not change other advices in list when updating', fakeAsync(() => {
      const otherAdvice: Advice = { ...mockAdvice, adviceId: '99', title: 'Other' };

      mockRepo.createAdvice.and.returnValue(of(mockAdvice));
      service.createAdvice(mockAdvice);
      tick();

      mockRepo.createAdvice.and.returnValue(of(otherAdvice));
      service.createAdvice(otherAdvice);
      tick();

      const updatedAdvice: Advice = { ...mockAdvice, title: 'Updated' };
      mockRepo.updateAdvice.and.returnValue(of(updatedAdvice));

      service.updateAdvice('1', updatedAdvice);
      tick();

      const state = service.advicesState();

      expect(state.list.find(a => a.adviceId === '1')?.title).toBe('Updated');
      expect(state.list.find(a => a.adviceId === '99')?.title).toBe('Other');
    }));


    it('should handle error when updating advice', fakeAsync(() => {
      const error: ApiError = { status: 404, message: 'Not Found' };
      mockRepo.updateAdvice.and.returnValue(throwError(() => error));

      service.updateAdvice('1', { title: 'Updated Title' });
      tick();

      expect(console.error).toHaveBeenCalledWith('Error updating therapy:', 'Not Found');
    }));
  });

  describe('deleteAdvice', () => {
    it('should delete an advice from list, filtered, and current', fakeAsync(() => {
      const newAdvice: Advice = { ...mockAdvice };
      mockRepo.createAdvice.and.returnValue(of(newAdvice));
      service.createAdvice(newAdvice);
      tick();

      mockRepo.deleteAdvice.and.returnValue(of(void 0));
      service.deleteAdvice(newAdvice);
      tick();

      const state = service.advicesState();
      expect(state.list).toEqual([]);
      expect(state.current).toBeNull();
    }));

    it('should delete advice from filtered and handle current correctly', fakeAsync(() => {
      const newAdvice: Advice = { ...mockAdvice };
      const filteredAdvice: Advice = { ...mockAdvice, adviceId: '2' };

      mockRepo.createAdvice.and.returnValue(of(newAdvice));
      service.createAdvice(newAdvice);
      tick();

      mockRepo.listAdvicesByTherapy.and.returnValue(of([newAdvice, filteredAdvice]));
      service.listAdvicesByTherapy('1');
      tick();

      mockRepo.deleteAdvice.and.returnValue(of(void 0));
      service.deleteAdvice(newAdvice);
      tick();

      const state = service.advicesState();
      expect(state.list.find(a => a.adviceId === '1')).toBeUndefined();
      expect(state.filtered.find(a => a.adviceId === '1')).toBeUndefined();
      expect(state.current).toBeNull();
    }));

    it('should handle error when deleting advice', fakeAsync(() => {
      const error: ApiError = { status: 403, message: 'Forbidden' };
      mockRepo.deleteAdvice.and.returnValue(throwError(() => error));

      service.deleteAdvice(mockAdvice);
      tick();

      expect(console.error).toHaveBeenCalledWith('Error deleting advice:', 'Forbidden');
    }));
  })
});
