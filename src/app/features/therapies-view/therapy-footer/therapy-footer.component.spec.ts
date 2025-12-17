import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapyFooterComponent } from './therapy-footer.component';

describe('TherapyFooterComponent', () => {
  let component: TherapyFooterComponent;
  let fixture: ComponentFixture<TherapyFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapyFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapyFooterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('advices', [ { adviceId: '1', title: 'Consejo' } ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
