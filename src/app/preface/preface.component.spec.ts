import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefaceComponent } from './preface.component';

describe('PrefaceComponent', () => {
  let component: PrefaceComponent;
  let fixture: ComponentFixture<PrefaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
