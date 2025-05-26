import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  dniBusqueda: string = '';
  usuarios: User[] = [];
  usuarioSeleccionado: User = {
    id: undefined,
    nombre: '',
    apellidos: '',
    dni: '',
    telefono: 0,
    email: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    cp: '',
    pais: '',
    nombreUsuarioApp: '',
    password: '',
    vehiculos: []
  };
  mostrarFormulario = false;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  abrirFormulario(usuario?: User) {
    if (usuario) {
      this.usuarioSeleccionado = { ...usuario }; // copia para editar
    } else {
      this.usuarioSeleccionado = {
        id: undefined,
        nombre: '',
        apellidos: '',
        dni: '',
        telefono: 0,
        email: '',
        direccion: '',
        ciudad: '',
        provincia: '',
        cp: '',
        pais: '',
        nombreUsuarioApp: '',
        password: '',
        vehiculos: []
      };
    }
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.usuarioSeleccionado = {
      id: undefined,
      nombre: '',
      apellidos: '',
      dni: '',
      telefono: 0,
      email: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      cp: '',
      pais: '',
      nombreUsuarioApp: '',
      password: '',
      vehiculos: []

    };
  }

  guardarUsuario() {
    if (this.usuarioSeleccionado.id && this.usuarioSeleccionado.id > 0) {
      // Actualizar usuario
      this.userService.update(this.usuarioSeleccionado).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al actualizar usuario', err)
      });
    } else {
      // Crear nuevo usuario
      this.userService.create(this.usuarioSeleccionado).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al crear usuario', err)
      });
    }
  }

  borrarUsuario(id?: number) {
    if (!id) return;
    if (confirm('¿Seguro que quieres borrar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => console.error('Error al borrar usuario', err)
      });
    }
  }
  buscarPorDni() {
  if (!this.dniBusqueda.trim()) {
    this.cargarUsuarios();
    return;
  }

  this.userService.getByDni(this.dniBusqueda).subscribe({
    next: (usuario) => {
      console.log('Respuesta del backend:', usuario);
      this.usuarios = usuario ? [usuario] : [];
    },
    error: (err) => {
      console.error('No se encontró el usuario con ese DNI', err);
      this.usuarios = [];
    }
  });
}
limpiarBusqueda() {
  this.dniBusqueda = '';
  this.cargarUsuarios();
}
}

