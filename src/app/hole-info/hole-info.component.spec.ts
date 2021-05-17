import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HoleInfoComponent } from './hole-info.component';

describe('HoleInfoComponent', () => {
  let component: HoleInfoComponent;
  let fixture: ComponentFixture<HoleInfoComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ HoleInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
