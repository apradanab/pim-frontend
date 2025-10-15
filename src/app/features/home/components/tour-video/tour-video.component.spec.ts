import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TourVideoComponent } from './tour-video.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TourVideoComponent', () => {
  let component: TourVideoComponent;
  let fixture: ComponentFixture<TourVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourVideoComponent],
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Google Maps in new tab when openGoogleMaps is called', () => {
    spyOn(window, 'open');
    const expectedUrl = 'https://www.google.com/maps/search/?api=1&query=Calle%20Par%C3%ADs%201%2C%20Montcada%2C%20Barcelona%2C%2008110';

    component.openGoogleMaps();

    expect(window.open).toHaveBeenCalledWith(expectedUrl);
  });
});
