import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoReparacionComponent } from './seguimiento-reparacion.component';

describe('SeguimientoReparacionComponent', () => {
  let component: SeguimientoReparacionComponent;
  let fixture: ComponentFixture<SeguimientoReparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoReparacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoReparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
