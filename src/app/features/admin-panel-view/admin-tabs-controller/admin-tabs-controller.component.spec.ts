import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTabsControllerComponent } from './admin-tabs-controller.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminTabsControllerComponent', () => {
  let component: AdminTabsControllerComponent;
  let fixture: ComponentFixture<AdminTabsControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTabsControllerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
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
});
