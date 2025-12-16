import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTabsControllerComponent } from './admin-tabs-controller.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/services/states/auth.state.service';

describe('AdminTabsControllerComponent', () => {
  let component: AdminTabsControllerComponent;
  let fixture: ComponentFixture<AdminTabsControllerComponent>;
  let router: jasmine.SpyObj<Router>;
  let mockAuthStateService: jasmine.SpyObj<AuthStateService>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthStateService = jasmine.createSpyObj('AuthStateService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [AdminTabsControllerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: AuthStateService, useValue: mockAuthStateService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTabsControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change active tab when setActiveTab is called', () => {
    component.setActiveTab('users');
    expect(component.activeTab).toBe('users');

    component.setActiveTab('appointments');
    expect(component.activeTab).toBe('appointments');
  });

  it('should call logout and navigate to /home when logout is called', () => {
    component.logout();
    expect(mockAuthStateService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  })
});
