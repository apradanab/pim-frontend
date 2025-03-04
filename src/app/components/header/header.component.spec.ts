import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebarActive state when toggleSidebar is called', () => {
    component.sidebarActive = false;
    component.toggleSidebar();
    expect(component.sidebarActive).toBeTrue();

    component.toggleSidebar();
    expect(component.sidebarActive).toBeFalse();

    component.sidebarActive = true;
    component.toggleSidebar();
    expect(component.sidebarActive).toBeFalse();
  })
});
