import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HoleInfoSheetComponent } from './hole-info-sheet.component';

describe('HoleInfoSheetComponent', () => {
  let component: HoleInfoSheetComponent;
  let fixture: ComponentFixture<HoleInfoSheetComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ HoleInfoSheetComponent ]
    })
    .compileComponents();
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
