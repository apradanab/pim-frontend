import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvicesShowcaseComponent } from './advices-showcase.component';

describe('AdvicesShowcaseComponent', () => {
  let component: AdvicesShowcaseComponent;
  let fixture: ComponentFixture<AdvicesShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvicesShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvicesShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
