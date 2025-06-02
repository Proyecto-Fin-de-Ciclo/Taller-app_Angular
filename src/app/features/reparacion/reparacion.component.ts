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
import { PresupuestoService } from '../../core/services/presupuesto.service';
import { Presupuesto } from '../../core/models/presupuesto';

@Component({
  selector: 'app-reparaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reparacion.component.html',
  styleUrls: ['./reparacion.component.css']
})
export class ReparacionesComponent implements OnInit {
  trabajadorSeleccionadoOrden: any = null;

  presupuestoCreado: boolean = false;
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
mostrarFormularioPiezas: boolean = false;
piezaSeleccionada: Pieza | null = null;
cantidadSeleccionada: number = 1;
reparacion!:Reparacion;
matricula: string = '';
  descripcionGeneral: string = '';
  mostrarFormularioPresupuesto: boolean = false;


  // Para filtros
  clienteSeleccionadoId: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
mensajeError: string = '';

  // Modal y formulario
  mostrarFormulario = false;
  reparacionSeleccionada: Reparacion = this.crearReparacionVacia();
  presupuestos: Presupuesto[] = [];

  constructor(
    private reparacionService: ReparacionService,
    private trabajadorService: TrabajadorService,
    private userService: UserService,
    private piezaService: PiezaService,
    private presupuestoService: PresupuestoService,
  ) {}
  ngOnInit(): void {

    this.cargarTodasLasReparaciones();
    this.cargarTrabajadores();
    this.cargarUsuarios();
    this.cargarPiezasDisponibles();
    this.obtenerPresupuestosAceptados();

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

cargarPiezasDisponibles(): void {
  this.piezaService.getAll().subscribe({
    next: (piezas) => {
      this.piezasDisponibles = piezas;
    },
    error: (err) => console.error('Error al cargar piezas:', err)
  });
}


  cargarTodasLasReparaciones(): void {
    this.reparacionService.getAll().subscribe({
      next: (data) => {
        this.reparacionesOriginales = data;
        this.reparaciones = data;
        this.reparaciones.forEach(r => this.verificarYActualizarEstado(r));
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
      this.reparacionService.getReparacionesPorCliente(Number(id)).subscribe({
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

abrirFormularioPiezas(reparacion?: Reparacion): void {
  if (!reparacion) {
    console.error("🚨 Llamada a abrirFormularioPiezas SIN reparación", new Error().stack);
    return;
  }

  reparacion.piezas = reparacion.piezas ?? [];
  this.reparacionSeleccionada = reparacion;
  this.mostrarFormularioPiezas = true;
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


cerrarFormularioPiezas(): void {
  this.mostrarFormularioPiezas = false;
}

// Método para añadir una pieza a la reparación
agregarPiezaAReparacion(): void {
  if (this.piezaSeleccionada && this.cantidadSeleccionada > 0) {
    if (!this.reparacionSeleccionada.piezas) {
      this.reparacionSeleccionada.piezas = [];
    }
    for (let i = 0; i < this.cantidadSeleccionada; i++) {
      this.reparacionSeleccionada.piezas.push(this.piezaSeleccionada);
    }

    // Limpiar selección
    this.piezaSeleccionada = null;
    this.cantidadSeleccionada = 1;
  } else {
    alert('Selecciona una pieza y cantidad válida.');
  }
}

// Método para eliminar una pieza de la reparación
eliminarPiezaDeReparacion(pieza: Pieza): void {
  this.reparacionSeleccionada.piezas = (this.reparacionSeleccionada.piezas ?? []).filter(
    (p) => p.id !== pieza.id
  );
}
get piezasAgrupadas() {
  const mapa = new Map<number, { pieza: Pieza; cantidad: number }>();

  (this.reparacionSeleccionada.piezas ?? []).forEach(pieza => {
    if (pieza.id == null) return; // si no tiene id, saltar
    if (mapa.has(pieza.id)) {
      mapa.get(pieza.id)!.cantidad++;
    } else {
      mapa.set(pieza.id, { pieza, cantidad: 1 });
    }
  });

  return Array.from(mapa.values());
}
guardarPiezas(): void {
  if (!this.reparacionSeleccionada || !this.reparacionSeleccionada.id) {
    alert('No hay una reparación seleccionada para guardar.');
    return;
  }


  let reparacionParaBackend: any = { ...this.reparacionSeleccionada };

  // Convertir trabajador y usuario a los DTO que espera el backend
  reparacionParaBackend.trabajadorDTO = reparacionParaBackend.trabajador;
  reparacionParaBackend.userDTO = reparacionParaBackend.user;

  // Borramos los campos originales para evitar conflictos en el backend
  delete reparacionParaBackend.trabajador;
  delete reparacionParaBackend.user;

  console.log('JSON que se enviará al backend:', JSON.stringify(reparacionParaBackend, null, 2));
  // Llamamos al servicio para actualizar la reparación con las piezas
  this.reparacionService.update(reparacionParaBackend).subscribe({
    next: (updated) => {
      // Actualizamos la lista local con la reparación actualizada
      const idx = this.reparaciones.findIndex(r => r.id === updated.id);
      if (idx >= 0) {
        this.reparaciones[idx] = updated;
      }
      alert('Piezas guardadas correctamente.');
      this.cerrarFormularioPiezas();
    },
    error: (err) => {
      console.error('Error al guardar piezas:', err);
      alert('Error guardando piezas.');
    }
  });
}



crearPresupuesto(): void {
  if (!this.reparacionSeleccionada) {
    alert('❌ Debes seleccionar una reparación');

    return;
  }

  if (!this.matricula.trim() || !this.descripcionGeneral.trim()) {
    alert('⚠️ Rellena todos los campos');
    return;
  }

   // ✅ Validar que hay al menos una pieza
  if (!this.reparacionSeleccionada.piezas || this.reparacionSeleccionada.piezas.length === 0) {
    alert('⚠️ No puedes crear un presupuesto sin añadir al menos una pieza');
    return;
  }


// Clonamos el objeto reparacionSeleccionada para no modificar el original
  let presupuestoDTO: any = { ...this.reparacionSeleccionada };

  // Cambiamos el nombre de las propiedades para que coincidan con lo que espera el backend
  presupuestoDTO.trabajadorDTO = presupuestoDTO.trabajador;
  presupuestoDTO.userDTO = presupuestoDTO.user;

  // Eliminamos las propiedades originales
  delete presupuestoDTO.trabajador;
  delete presupuestoDTO.user;

  // Añadimos los campos específicos para el presupuesto
const crearPresupuestoRequest = {
  reparacionDTO: presupuestoDTO,
  matricula: this.matricula.trim(),
  descripcion: this.descripcionGeneral
};

  // Llamamos al servicio para crear el presupuesto
  this.presupuestoService.crearPresupuesto(crearPresupuestoRequest).subscribe({
    next: (res) => {
      alert('Presupuesto creado correctamente');
      this.mostrarFormularioPresupuesto = false;
    },
    error: (err) => {
      console.error('Error al crear presupuesto:', err);
      alert('Error al crear presupuesto');
    }
  });
}
mostrarFormularioPre() {
  this.mostrarFormularioPresupuesto = true;
}

cancelarFormulario() {
  this.mostrarFormularioPresupuesto = false;
}
obtenerPresupuestosAceptados(): void {
    this.presupuestoService.findAllByAceptadoTrue().subscribe((data: Presupuesto[]) => {
      this.presupuestos = data;

    });

  }



esClienteConPresupuestoAceptado(reparacion: any): boolean {
  const resultado = this.presupuestos.some(p => {
    const propietario = p.vehiculo?.propietario;

    if (!propietario || !reparacion.user?.dni ) return false;

    return propietario.dni.trim().toLowerCase() === reparacion.user.dni.trim().toLowerCase();
  });

  console.log(
    '¿Coincide DNI de',
    reparacion.user?.dni,
    '? →',
    resultado
  );

  return resultado;
}
verificarYActualizarEstado(reparacion: Reparacion): void {
  const tienePresupuestoAceptado = this.esClienteConPresupuestoAceptado(reparacion);


  if (tienePresupuestoAceptado && reparacion.estado === 'PENDIENTE') {
    this.actualizarEstado(reparacion);
  }

  console.info("📅 Hora fin:", reparacion.horaFin);

  if (reparacion.estado === 'EN_CABINA' &&reparacion.horaFin && reparacion.horaFin.trim() !== '') {

    this.actualizarEstado(reparacion);
  }
}

}
