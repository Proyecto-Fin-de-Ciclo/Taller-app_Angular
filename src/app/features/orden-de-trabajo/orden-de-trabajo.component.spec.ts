import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenDeTrabajoComponent } from './orden-de-trabajo.component';

describe('OrdenDeTrabajoComponent', () => {
  let component: OrdenDeTrabajoComponent;
  let fixture: ComponentFixture<OrdenDeTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenDeTrabajoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenDeTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
