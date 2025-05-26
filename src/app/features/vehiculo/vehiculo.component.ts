import { Component, OnInit } from '@angular/core';
import { Vehiculo } from '../../core/models/vehiculo';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { CompaniaAseguradora } from '../../core/models/compania-aseguradora';
import { CompaniaAseguradoraService } from '../../core/services/CompaniaAseguradora.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent implements OnInit {

  vehiculos: Vehiculo[] = [];
  vehiculoSeleccionado: Vehiculo = {
    marca: '',
    modelo: '',
    matricula: '',
    color: '',
    numeroBastidor: '',
    propietario: {} as User,
    companiaAseguradora: {} as CompaniaAseguradora
  };

  mostrarFormulario = false;
  matriculaBusqueda: string = '';

  usuarios: User[] = [];
  companias: CompaniaAseguradora[] = [];

  constructor(
    private vehiculoService: VehiculoService,
    private userService: UserService,
    private companiaService: CompaniaAseguradoraService
  ) {}

  ngOnInit(): void {
    this.cargarVehiculos();
    this.cargarUsuarios();
    this.cargarCompanias();
  }

  cargarVehiculos() {
    this.vehiculoService.getAll().subscribe({
      next: (data) => this.vehiculos = data,
      error: (err) => console.error('Error al cargar vehículos', err)
    });
  }

  cargarUsuarios() {
    this.userService.getAll().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  cargarCompanias() {
    this.companiaService.getAll().subscribe({
      next: (data) => this.companias = data,
      error: (err) => console.error('Error al cargar compañías', err)
    });
  }

  abrirFormulario(vehiculo?: Vehiculo) {
    if (vehiculo) {
      this.vehiculoSeleccionado = { ...vehiculo };
    } else {
      this.vehiculoSeleccionado = {
        marca: '',
        modelo: '',
        matricula: '',
        color: '',
        numeroBastidor: '',
        propietario: {} as User,
        companiaAseguradora: {} as CompaniaAseguradora
      };
    }
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.vehiculoSeleccionado = {
      marca: '',
      modelo: '',
      matricula: '',
      color: '',
      numeroBastidor: '',
      propietario: {} as User,
      companiaAseguradora: {} as CompaniaAseguradora
    };
  }

  guardarVehiculo() {
    console.log('Objeto vehiculo a enviar:', this.vehiculoSeleccionado);
    if (this.vehiculoSeleccionado.id && this.vehiculoSeleccionado.id > 0) {
      this.vehiculoService.update(this.vehiculoSeleccionado).subscribe({
        next: () => {
          this.cargarVehiculos();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al actualizar vehículo', err)
      });
    } else {
      this.vehiculoService.create(this.vehiculoSeleccionado).subscribe({
        next: () => {
          this.cargarVehiculos();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al crear vehículo', err)
      });
    }
  }

  borrarVehiculo(id?: number) {
    if (!id) return;
    if (confirm('¿Seguro que quieres borrar este vehículo?')) {
      this.vehiculoService.delete(id).subscribe({
        next: () => this.cargarVehiculos(),
        error: (err) => console.error('Error al borrar vehículo', err)
      });
    }
  }

  buscarPorMatricula() {
    if (!this.matriculaBusqueda.trim()) {
      this.cargarVehiculos();
      return;
    }

    this.vehiculoService.getByMatricula(this.matriculaBusqueda).subscribe({
      next: (vehiculo) => {
        this.vehiculos = vehiculo ? [vehiculo] : [];
      },
      error: (err) => {
        console.error('No se encontró vehículo con esa matrícula', err);
        this.vehiculos = [];
      }
    });
  }

  limpiarBusqueda() {
    this.matriculaBusqueda = '';
    this.cargarVehiculos();
  }

}

