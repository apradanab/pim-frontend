import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourVideoComponent } from './tour-video.component';

describe('TourVideoComponent', () => {
  let component: TourVideoComponent;
  let fixture: ComponentFixture<TourVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
