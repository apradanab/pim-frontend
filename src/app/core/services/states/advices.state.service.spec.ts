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
      'createAdvice'
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
  })
});
