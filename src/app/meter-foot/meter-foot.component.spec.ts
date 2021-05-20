import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeterFootComponent } from './meter-foot.component';

describe('MeterFootComponent', () => {
  let component: MeterFootComponent;
  let fixture: ComponentFixture<MeterFootComponent>;

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [MeterFootComponent]
  }).compileComponents());

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterFootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
