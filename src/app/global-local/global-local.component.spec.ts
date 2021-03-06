import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalLocalComponent } from './global-local.component';

describe('GlobalLocalComponent', () => {
  let component: GlobalLocalComponent;
  let fixture: ComponentFixture<GlobalLocalComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ GlobalLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
