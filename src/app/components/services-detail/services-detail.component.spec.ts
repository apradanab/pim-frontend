import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesDetailComponent } from './services-detail.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService } from '../../services/state.service';
import { provideHttpClient } from '@angular/common/http';

describe('ServicesDetailComponent', () => {
  let component: ServicesDetailComponent;
  let fixture: ComponentFixture<ServicesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDetailComponent],
      providers: [
        StateService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
