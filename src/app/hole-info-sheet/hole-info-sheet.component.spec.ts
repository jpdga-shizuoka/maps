import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoleInfoSheetComponent } from './hole-info-sheet.component';

describe('HoleInfoSheetComponent', () => {
  let component: HoleInfoSheetComponent;
  let fixture: ComponentFixture<HoleInfoSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoleInfoSheetComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoleInfoSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
