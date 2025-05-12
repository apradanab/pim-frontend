import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FeatureBoxesComponent } from './feature-boxes.component';

describe('FeatureBoxesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureBoxesComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FeatureBoxesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
