import { ComponentFixture, TestBed } from '@angular/core/testing';
import  AdvicesViewComponent  from './advices-view.component';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('AdvicesViewComponent', () => {
  let component: AdvicesViewComponent;
  let fixture: ComponentFixture<AdvicesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvicesViewComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvicesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
