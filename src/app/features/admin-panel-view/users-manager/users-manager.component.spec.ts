import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersManagerComponent } from './users-manager.component';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { User } from '../../../models/user.model';
import { signal } from '@angular/core';

class MockUsersStateService {
  usersState = signal<{ list: User[]; error: null | string }>({ list: [], error: null });
  listUsers = jasmine.createSpy('listUsers').and.resolveTo();
  approveUser = jasmine.createSpy('approveUser').and.resolveTo();
  deleteUser = jasmine.createSpy('deleteUser').and.resolveTo();
}

class MockDateTimeService {
  sortItemsByDate = jasmine.createSpy('sortItemsByDate').and.callFake((arr: User[]) => arr);
}

describe('UsersManagerComponent', () => {
  let component: UsersManagerComponent;
  let fixture: ComponentFixture<UsersManagerComponent>;
  let mockStateService: MockUsersStateService;
  let mockDateService: MockDateTimeService;

  beforeEach(async () => {
    mockStateService = new MockUsersStateService();
    mockDateService = new MockDateTimeService();

    await TestBed.configureTestingModule({
      imports: [UsersManagerComponent],
      providers: [
        { provide: UsersStateService, useValue: mockStateService },
        { provide: DateTimeService, useValue: mockDateService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(mockStateService.listUsers).toHaveBeenCalled();
  });

  it('should set userToDelete when handleDelete is called', () => {
    component.handleDelete('test-id');
    expect(component.userToDelete()).toBe('test-id');
  });

  it('should cancel delete', () => {
    component.userToDelete.set('test-id');
    component.cancelDelete();
    expect(component.userToDelete()).toBeNull();
  });

  it('should confirm delete and call deleteUser', async () => {
    await component.confirmDelete('abc');
    expect(mockStateService.deleteUser).toHaveBeenCalledWith('abc');
    expect(component.userToDelete()).toBeNull();
  });

  it('should log error if deleteUser fails', async () => {
    const error = new Error('fail delete');
    mockStateService.deleteUser.and.rejectWith(error);
    spyOn(console, 'error');
    await component.confirmDelete('abc');
    expect(console.error).toHaveBeenCalledWith('Failed to delete user:', error);
    expect(component.userToDelete()).toBeNull();
  });

  it('should order users with createdAt', () => {
    const users = [
      { userId: '1', createdAt: new Date('2025-01-01') } as unknown as User,
      { userId: '2', createdAt: null } as unknown as User,
      { userId: '3', createdAt: new Date('2025-02-01') } as unknown as User,
    ];
    mockStateService.usersState.set({ list: users, error: null });
    const result = component.orderedUsers();
    expect(mockDateService.sortItemsByDate).toHaveBeenCalledWith(
      [users[0], users[2]],
      jasmine.any(Function)
    );
    expect(result).toEqual([users[0], users[2]]);
  });

  it('should call approveUser', async () => {
    await component.handleApprove('1');
    expect(mockStateService.approveUser).toHaveBeenCalledWith('1');
  });

  it('should log error if approveUser fails', async () => {
    const error = new Error('fail approve');
    mockStateService.approveUser.and.rejectWith(error);
    spyOn(console, 'error');
    await component.handleApprove('1');
    expect(console.error).toHaveBeenCalledWith('Failed to approve user:', error);
  });

  it('should log error if approveUser fails', async () => {
    const error = new Error('fail');
    mockStateService.approveUser.and.rejectWith(error);
    spyOn(console, 'error');
    await component.handleApprove('1');
    expect(console.error).toHaveBeenCalledWith('Failed to approve user:', error);
  });
});
