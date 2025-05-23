import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezasComponent } from './piezas.component';

describe('PiezasComponent', () => {
  let component: PiezasComponent;
  let fixture: ComponentFixture<PiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiezasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
