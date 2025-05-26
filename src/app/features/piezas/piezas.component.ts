import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PiezaService } from '../../core/services/pieza.service';
import { Pieza } from '../../core/models/pieza';

@Component({
  selector: 'app-piezas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [PiezaService],
  templateUrl: './piezas.component.html',
  styleUrls: ['./piezas.component.css']
})
export class PiezasComponent implements OnInit {
  piezas: Pieza[] = [];
  piezaForm: FormGroup;
  editingPieza: Pieza | null = null;
  expandedIds: Set<number> = new Set();
  editMode: boolean = false;

  constructor(
    private service: PiezaService,
    private fb: FormBuilder
  ) {
    this.piezaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      proveedor: ['', Validators.required],
      referencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarPiezas();
  }

  cargarPiezas() {
    this.service.getAll().subscribe(data => {
      this.piezas = data;
    });
  }

  toggleExpand(id: number) {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
      this.editMode = false;
    } else {
      this.expandedIds.add(id);
      this.editMode = false;
    }
  }

  toggleEdit(pieza: Pieza) {
    if (!this.expandedIds.has(pieza.id!)) {
      this.expandedIds.add(pieza.id!);
    }
    this.editMode = true;
    this.editingPieza = pieza;
    this.piezaForm.patchValue(pieza);
  }

  onSubmit() {
    if (this.piezaForm.invalid) return;
    const piezaToSave: Pieza = this.piezaForm.value;
    console.log('Objeto Pieza que se va a enviar:', piezaToSave);

    if (this.editingPieza) {
      const updated = { ...this.editingPieza, ...this.piezaForm.value };
      this.service.update(updated).subscribe(() => {
        this.cargarPiezas();
        this.resetForm();
        this.editMode = false;
        if (this.editingPieza?.id) {
          this.expandedIds.delete(this.editingPieza.id);
        }
        this.editingPieza = null;
      });
    } else {
      this.service.add(this.piezaForm.value).subscribe(() => {
        this.cargarPiezas();
        this.resetForm();
        this.editMode = false;
        this.editingPieza = null;
      });
    }
  }

  editarPieza(pieza: Pieza) {
    this.toggleEdit(pieza);
  }

  borrarPieza(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Seguro que quieres borrar esta pieza?')) {
      this.service.delete(id).subscribe(() => {
        this.cargarPiezas();
        this.expandedIds.delete(id);
      });
    }
  }

  resetForm() {
    this.piezaForm.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      proveedor: '',
      referencia: ''
    });
    this.editMode = false;
    this.editingPieza = null;
    this.expandedIds.clear();
  }

  anadirPieza() {
    this.resetForm();
    this.editMode = true;
  }
}
