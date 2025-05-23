import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompaniaAseguradoraService } from '../../core/services/CompaniaAseguradora.service';
import { CompaniaAseguradora } from '../../core/models/compania-aseguradora';


@Component({
  selector: 'app-companias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [CompaniaAseguradoraService],
  templateUrl: './companias.component.html',
  styleUrls: ['./companias.component.css']
})
export class CompaniasComponent implements OnInit {
  companias: CompaniaAseguradora[] = [];
  companiaForm: FormGroup;
  editingCompania: CompaniaAseguradora | null = null;
  expandedIds: Set<number> = new Set();  // Para controlar qué desplegables están abiertos
  editMode: boolean = false; // Controla si estamos en modo edición

  constructor(
    private service: CompaniaAseguradoraService,
    private fb: FormBuilder
  ) {
    this.companiaForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      concertado: [false]
    });
    
  }

  ngOnInit(): void {
    this.cargarCompanias();
  }

  cargarCompanias() {
    this.service.getAll().subscribe(data => {
      this.companias = data;
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

  toggleEdit(compania: CompaniaAseguradora) {
    if (!this.expandedIds.has(compania.id!)) {
      this.expandedIds.add(compania.id!);
    }
    this.editMode = true;
    this.editingCompania = compania;
    this.companiaForm.patchValue(compania);
  }

onSubmit() {
  if (this.companiaForm.invalid) return;

  console.log('--- onSubmit ---');
  console.log('editMode antes:', this.editMode);
  console.log('editingCompania antes:', this.editingCompania);
  console.log('expandedIds antes:', Array.from(this.expandedIds));

  if (this.editingCompania) {
    const updated = { ...this.editingCompania, ...this.companiaForm.value };
    this.service.update(updated).subscribe(() => {
      console.log('Guardado actualización OK');
      this.cargarCompanias();
      this.resetForm();
      this.editMode = false;
      if (this.editingCompania?.id) {
        this.expandedIds.delete(this.editingCompania.id);
      }
      this.editingCompania = null;

      console.log('editMode después:', this.editMode);
      console.log('editingCompania después:', this.editingCompania);
      console.log('expandedIds después:', Array.from(this.expandedIds));
    });
  } else {
    this.service.add(this.companiaForm.value).subscribe(() => {
      console.log('Guardado creación OK');
      this.cargarCompanias();
      this.resetForm();
      this.editMode = false;
      this.editingCompania = null;

      console.log('editMode después:', this.editMode);
      console.log('editingCompania después:', this.editingCompania);
      console.log('expandedIds después:', Array.from(this.expandedIds));
    });
  }
}




  editarCompania(compania: CompaniaAseguradora) {
    this.toggleEdit(compania);
  }

  borrarCompania(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Seguro que quieres borrar esta compañía?')) {
      this.service.delete(id).subscribe(() => {
        this.cargarCompanias();
        this.expandedIds.delete(id);
      });
    }
  }

resetForm() {
  // 1. Limpiar los valores del formulario
  this.companiaForm.reset({
    nombre: '',
    telefono: '',
    email: '',
    concertado: false
  });
  // 2. Salir del modo edición/añadir
  this.editMode = false;
  // 3. Limpiar la compañía activa
  this.editingCompania = null;
  // 4. Cerrar todos los paneles expandidos
  this.expandedIds.clear();
}



  // Método para añadir una nueva compañía (abre el formulario vacío en modo edición)
  anadirCompania() {
    this.resetForm();
    this.editMode = true;
    // Para añadir, el formulario estará visible y vacío
    // Podrías añadir lógica extra para abrir un desplegable nuevo si quieres
  }
}


