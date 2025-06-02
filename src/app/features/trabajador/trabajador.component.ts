import { Component, OnInit } from '@angular/core';
import { Trabajador } from '../../core/models/trabajador';
import { TrabajadorService } from '../../core/services/trabajador.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth-service.service';

@Component({
  selector: 'app-trabajador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.css']
})
export class TrabajadorComponent implements OnInit {
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  trabajadores: Trabajador[] = [];
  trabajadorSeleccionado: Trabajador = {
    id: undefined,
    nombreCompleto: '',
    codigoEmpleado: '',
    imagen: '',
    telefono: '',
    nombreUsuarioApp: '',
  };
  mostrarFormulario = false;
  username: string = '';

  constructor(public trabajadorService: TrabajadorService,private authService: AuthService) {}

  ngOnInit(): void {
    setTimeout(() => {
    this.username = this.authService.getUsername() ?? '';


    if (!this.username) {
      console.error('No se encontró el nombre de usuario');
      return;
    }

    this.cargarTrabajadores();
  }, 500); // este retraso depende de tu red y servidor, por eso es inestable
}

  cargarTrabajadores() {
    this.trabajadorService.getAll().subscribe({
      next: (data) => this.trabajadores = data.map(t => ({
        ...t,
        urlImagen: t.imagen ? this.trabajadorService.getImagen(t.imagen) : 'assets/images/default.png'
      })),
      error: (err) => console.error('Error al cargar trabajadores', err)
    });
  }

  abrirFormulario(trabajador?: Trabajador) {
    if (trabajador) {
      this.trabajadorSeleccionado = { ...trabajador }; // copia para editar
      this.imagenPreview = this.trabajadorSeleccionado.imagen
        ? this.trabajadorService.getImagen(this.trabajadorSeleccionado.imagen)
        : null;
    } else {
      this.trabajadorSeleccionado = {
        id: undefined,
        nombreCompleto: '',
        codigoEmpleado: '',
        imagen: '',
        telefono: '',
        nombreUsuarioApp: '',
      };
      this.imagenPreview = null;
    }
    this.imagenSeleccionada = null;
    this.mostrarFormulario = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenSeleccionada = input.files[0];
      this.imagenPreview = URL.createObjectURL(this.imagenSeleccionada);
    }
  }

  cerrarFormulario() {
    console.log('cerrando')
    this.mostrarFormulario = false;
    this.trabajadorSeleccionado = {
      id: 0,
      nombreCompleto: '',
      codigoEmpleado: '',
      imagen: '',
      telefono: '',
      nombreUsuarioApp: '',
    };
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  guardarTrabajador() {
    this.trabajadorSeleccionado.nombreUsuarioApp = this.username;
  const guardarDatos = () => {
    if (this.trabajadorSeleccionado.id && this.trabajadorSeleccionado.id > 0) {
      // Actualizar trabajador
      this.trabajadorService.update(this.trabajadorSeleccionado).subscribe({
        next: () => {
          this.cargarTrabajadores();
          this.cerrarFormulario();
          this.imagenSeleccionada = null;
          this.imagenPreview = null;
        },
        error: (err) => console.error('Error al actualizar trabajador', err)
      });
    } else {
      // Crear nuevo trabajador
      this.trabajadorService.create(this.trabajadorSeleccionado).subscribe({
        next: () => {
          this.cargarTrabajadores();
          this.cerrarFormulario();
          this.imagenSeleccionada = null;
          this.imagenPreview = null;
        },
        error: (err) => console.error('Error al crear trabajador', err)
      });
    }
  };

  if (this.imagenSeleccionada) {
    // Si hay imagen seleccionada, la subimos primero
    const formData = new FormData();
    formData.append('file', this.imagenSeleccionada);

    this.trabajadorService.uploadImagen(formData).subscribe({
      next: (response) => {
        // Aquí asumimos que la respuesta te devuelve el nombre del archivo subido
        if (response && response.nombreArchivo) {
          this.trabajadorSeleccionado.imagen = response.nombreArchivo;
        }
        guardarDatos();
      },
      error: (err) => console.error('Error al subir imagen', err)
    });
  } else {
    // Si no hay imagen seleccionada, guardamos directamente
    guardarDatos();
  }
}


  borrarTrabajador(id?: number) {
    if (!id) return;
    if (confirm('¿Seguro que quieres borrar este trabajador?')) {
      this.trabajadorService.delete(id).subscribe({
        next: () => this.cargarTrabajadores(),
        error: (err) => console.error('Error al borrar trabajador', err)
      });
    }
  }
}
