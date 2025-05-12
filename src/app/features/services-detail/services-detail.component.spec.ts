import { ComponentFixture, TestBed } from '@angular/core/testing';
import  ServicesDetailComponent  from './services-detail.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService } from '../../core/services/state.service';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ServicesDetailComponent', () => {
  let component: ServicesDetailComponent;
  let fixture: ComponentFixture<ServicesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDetailComponent],
      providers: [
        StateService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'terapia-individual' })
          }
        }
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
