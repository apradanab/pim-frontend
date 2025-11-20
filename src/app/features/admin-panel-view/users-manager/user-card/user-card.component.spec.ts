import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  const mockUser = {
    userId: '1',
    name: 'Test User',
    email: 'test@test.com',
    message: 'Hello world',
    approved: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isExpanded', () => {
    expect(component.isExpanded()).toBeFalse();
    component.toggleExpanded();
    expect(component.isExpanded()).toBeTrue();
  })
});
