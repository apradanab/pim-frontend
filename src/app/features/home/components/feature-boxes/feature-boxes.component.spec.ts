import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FeatureBoxesComponent } from './feature-boxes.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('FeatureBoxesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureBoxesComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FeatureBoxesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
