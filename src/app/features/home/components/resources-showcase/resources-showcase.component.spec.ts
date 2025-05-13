import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesShowcaseComponent } from './resources-showcase.component';

describe('ResourcesShowcaseComponent', () => {
  let component: ResourcesShowcaseComponent;
  let fixture: ComponentFixture<ResourcesShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
