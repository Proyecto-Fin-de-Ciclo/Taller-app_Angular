import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reparacion } from '../../core/models/reparacion';
import { ReparacionService } from '../../core/services/reparacion.service';
import { Trabajador } from '../../core/models/trabajador';
import { User } from '../../core/models/user';
import { TrabajadorService } from '../../core/services/trabajador.service';
import { UserService } from '../../core/services/user.service';
import { Pieza } from '../../core/models/pieza';
import { PiezaService } from '../../core/services/pieza.service';

@Component({
  selector: 'app-reparaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reparacion.component.html',
  styleUrls: ['./reparacion.component.css']
})
export class ReparacionesComponent implements OnInit {
  reparaciones: Reparacion[] = [];
  reparacionesOriginales: Reparacion[] = [];
  trabajadores: Trabajador[] = [];
  usuarios: User[] = [];
  usuarioAnadido!: User;
  trabajadorAnadido!: Trabajador;
  piezasDisponibles: Pieza[] = [];
  mostrarFormularioOrden = false;
descripcionOrden: string = '';
matriculaOrden: string = '';
reparacionSeleccionadaParaOrden!: Reparacion | null;

  // Para filtros
  clienteSeleccionadoId: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
mensajeError: string = '';

  // Modal y formulario
  mostrarFormulario = false;
  reparacionSeleccionada: Reparacion = this.crearReparacionVacia();

  constructor(
    private reparacionService: ReparacionService,
    private trabajadorService: TrabajadorService,
    private userService: UserService,
    private piezaService: PiezaService
  ) {}

  ngOnInit(): void {

    this.cargarTodasLasReparaciones();
    this.cargarTrabajadores();
    this.cargarUsuarios();
  }

  crearReparacionVacia(): Reparacion {
  return {
    descripcion: '',
    trabajador: this.trabajadorAnadido,
    horaInicio: '',
    horaFin: '',
    estado: 'PENDIENTE',
    user: this.usuarioAnadido,
    piezas: []
  };
}




  cargarTodasLasReparaciones(): void {
    this.reparacionService.getAll().subscribe({
      next: (data) => {
        this.reparacionesOriginales = data;
        this.reparaciones = data;
      },
      error: (err) => console.error('Error al cargar reparaciones:', err)
    });
  }

  cargarTrabajadores(): void {
    this.trabajadorService.getAll().subscribe({
      next: (data) => this.trabajadores = data,
      error: (err) => console.error('Error al cargar trabajadores:', err)
    });
  }

  cargarUsuarios(): void {
    this.userService.getAll().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  filtrarPorCliente(): void {
    const id = this.clienteSeleccionadoId.trim();
    if (id) {
      this.reparacionService.getReparacionesPorCliente(id).subscribe({
        next: (data) => {
          this.reparacionesOriginales = data;
          this.reparaciones = data;
        },
         error: (err) => {
        console.error('Error al filtrar por id:', err);
        alert('Error al buscar cliente. Verifica que el ID es correcto.');
      }
      });
    } else {
      this.cargarTodasLasReparaciones();
    }
  }

  aplicarFiltroFecha(): void {
    if (this.fechaInicio && this.fechaFin) {
      const inicio = this.fechaInicio + 'T00:00:00';
      const fin = this.fechaFin + 'T23:59:59';

      console.log('Rango enviado al backend:', inicio, 'hasta', fin);

      this.reparacionService.getReparacionesPorFecha(inicio, fin).subscribe({
        next: (data) => {
          this.reparaciones = data;
          this.reparacionesOriginales = data;
        },
       error: (err) => {
        console.error('Error al filtrar por fecha:', err);
      }
      });
    } else {
      this.cargarTodasLasReparaciones();
    }
  }

  formatFecha(fechaIso: string): string {
    return fechaIso ? new Date(fechaIso).toLocaleDateString() : 'N/A';
  }

  obtenerSiguienteEstado(estadoActual: string): string | null {
    const ordenEstados = ['PENDIENTE', 'EN_PROCESO', 'EN_CABINA', 'FINALIZADA', 'CANCELADA'];
    const index = ordenEstados.indexOf(estadoActual);
    if (index >= 0 && index < ordenEstados.length - 1) {
      return ordenEstados[index + 1];
    }
    return null;
  }

  actualizarEstado(reparacion: Reparacion): void {
    const siguienteEstado = this.obtenerSiguienteEstado(reparacion.estado);
    if (!siguienteEstado) {
      alert('No se puede avanzar el estado, ya está FINALIZADA o CANCELADA');
      return;
    }

    this.reparacionService.updateEstado(reparacion.id!, siguienteEstado).subscribe({
      next: (updatedReparacion) => {
        reparacion.estado = updatedReparacion.estado;
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        alert('Error actualizando el estado');
      }
    });
  }

  limpiarEstado(reparacion: Reparacion) {
    const estadoInicial = 'PENDIENTE';
    this.reparacionService.updateEstado(reparacion.id!, estadoInicial).subscribe({
      next: () => {
        reparacion.estado = estadoInicial;
        console.log('Estado reiniciado a PENDIENTE');
      },
      error: (err) => {
        console.error('Error al reiniciar estado:', err);
      }
    });
  }

  // Abrir formulario modal para nueva o editar
  abrirFormulario(reparacion?: Reparacion): void {
    if (reparacion) {
      // Clonar objeto para no modificar original hasta guardar
      this.reparacionSeleccionada = { ...reparacion };
    } else {
      this.reparacionSeleccionada = this.crearReparacionVacia();
    }
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarReparacion(): void {
  if (!this.reparacionSeleccionada.descripcion || !this.reparacionSeleccionada.horaInicio || !this.reparacionSeleccionada.user || !this.reparacionSeleccionada.estado) {
    alert('Por favor, rellena todos los campos obligatorios');
    return;
  }

  let reparacionParaBackend: any = { ...this.reparacionSeleccionada };
  reparacionParaBackend.trabajadorDTO = reparacionParaBackend.trabajador;
  reparacionParaBackend.userDTO = reparacionParaBackend.user;
  delete reparacionParaBackend.trabajador;
  delete reparacionParaBackend.user;

  if (this.reparacionSeleccionada.id) {
    this.reparacionService.update(reparacionParaBackend).subscribe({
      next: (updated) => {
        const idx = this.reparaciones.findIndex(r => r.id === updated.id);
        if (idx >= 0) {
          this.reparaciones[idx] = updated;
        }
        this.cerrarFormulario();
      },
      error: (err) => {
        console.error('Error actualizando reparación:', err);
        alert('Error actualizando reparación');
      }
    });
  } else {
    this.reparacionService.add(reparacionParaBackend).subscribe({
      next: (created) => {
        this.cargarTodasLasReparaciones();
        this.cerrarFormulario();
      },
      error: (err) => {
        console.error('Error creando reparación:', err);
        alert('Error creando reparación');
      }
    });
  }
}
abrirFormularioOrden() {
  this.reparacionSeleccionadaParaOrden = null;
  this.descripcionOrden = '';
  this.matriculaOrden = '';
  this.mostrarFormularioOrden = true;
}

cerrarFormularioOrden() {
  this.mostrarFormularioOrden = false;
}

enviarOrdenDeTrabajo() {
  if (!this.reparacionSeleccionadaParaOrden || !this.descripcionOrden || !this.matriculaOrden) {
    alert('Por favor, selecciona una reparación y completa los campos');
    return;
  }

  let reparacionDTO: any = { ...this.reparacionSeleccionadaParaOrden };
  reparacionDTO.trabajadorDTO = reparacionDTO.trabajador;
  reparacionDTO.userDTO = reparacionDTO.user;
  delete reparacionDTO.trabajador;
  delete reparacionDTO.user;

  this.reparacionService.addOrdenDeTrabajo(reparacionDTO, this.descripcionOrden, this.matriculaOrden).subscribe({
    next: (res) => {
      alert('Orden de trabajo añadida correctamente');
      this.cerrarFormularioOrden();
    },
    error: (err) => {
      console.error('Error al crear orden de trabajo:', err);
      alert('Error al crear orden de trabajo');
    }
  });
}
}
