import { ComponentFixture, TestBed } from '@angular/core/testing';
import  TherapiesViewComponent  from './therapies-view.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersStateService } from '../../core/services/states/users.state.service';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TherapiesViewComponent', () => {
  let component: TherapiesViewComponent;
  let fixture: ComponentFixture<TherapiesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapiesViewComponent],
      providers: [
        UsersStateService,
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

    fixture = TestBed.createComponent(TherapiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
