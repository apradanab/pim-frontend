import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CancellationModalComponent } from './cancellation-modal.component';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('CancellationModalComponent', () => {
  let component: CancellationModalComponent;
  let fixture: ComponentFixture<CancellationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FontAwesomeTestingModule, CancellationModalComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CancellationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show and close cancellation policy modal', () => {
    const event = new Event('click');
    spyOn(event, 'preventDefault');
    component.showCancellationPolicy(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.showPolicy).toBeTrue();

    component.closePolicyModal();
    expect(component.showPolicy).toBeFalse();
  });

  it('should emit confirm event when form is valid', () => {
    const emitSpy = spyOn(component.confirm, 'emit');
    component.cancellationForm.setValue({
      notes: 'Motivo con mas de 20 caracteres',
      cancellationPolicy: true
    });

    component.confirmCancellation();

    expect(emitSpy).toHaveBeenCalledWith({
      notes: 'Motivo con mas de 20 caracteres'
    });
    expect(component.cancellationForm.value).toEqual({
      notes: '',
      cancellationPolicy: false
    });
  });

  it('should not emit confirm event when form is invalid', () => {
    const emitSpy = spyOn(component.confirm, 'emit');
    component.cancellationForm.setValue({
      notes: '',
      cancellationPolicy: false
    });

    component.confirmCancellation();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit close event and reset form when closing modal', () => {
    const emitSpy = spyOn(component.close, 'emit');
    component.showPolicy = true;

    component.closeModal();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.cancellationForm.value).toEqual({
      notes: '',
      cancellationPolicy: false
    });
    expect(component.showPolicy).toBeFalse();
  });
});
