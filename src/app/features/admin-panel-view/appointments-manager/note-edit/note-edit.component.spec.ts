import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteEditComponent } from './note-edit.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('NoteEditComponent', () => {
  let component: NoteEditComponent;
  let fixture: ComponentFixture<NoteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEditComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit current note content when the save button is called', () => {
    const newNote = 'Nota';

    component.currentNote.set(newNote);
    fixture.detectChanges();

    spyOn(component.noteSaved, 'emit');

    const saveButton = fixture.debugElement.query(By.css('.save-note-btn')).nativeElement;
    saveButton.click();

    expect(component.noteSaved.emit).toHaveBeenCalledWith(newNote);
  })
});
