import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorDahsboardComponent } from './trabajador-dahsboard.component';

describe('TrabajadorDahsboardComponent', () => {
  let component: TrabajadorDahsboardComponent;
  let fixture: ComponentFixture<TrabajadorDahsboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrabajadorDahsboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrabajadorDahsboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
