import { ReparacionService } from './../../core/services/reparacion.service';
import { Component, OnInit } from '@angular/core';
import { OrdenDeTrabajoService } from '../../core/services/ordenDeTrabajoService';
import { TrabajadorService } from '../../core/services/trabajador.service';
import { OrdenDeTrabajo } from '../../core/models/ordenDeTrabajo';
import { Trabajador } from '../../core/models/trabajador';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pieza } from '../../core/models/pieza';
import { FinalizarOrdenDeTrabajoDTO } from '../../core/models/finalizarOrdenDeTrabajo';


@Component({
  selector: 'app-ordenes-trabajo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden-de-trabajo.component.html',
  styleUrls: ['./orden-de-trabajo.component.css']
})
export class OrdenesTrabajoComponent implements OnInit {
  ordenes: OrdenDeTrabajo[] = [];
  ordenesFiltradas: OrdenDeTrabajo[] = [];
  trabajadores: Trabajador[] = [];

  filtroDNI = '';
  filtroMatricula = '';
  filtroTrabajadorId: number | null = null;

  constructor(
    private ordenTrabajoService: OrdenDeTrabajoService,
    private trabajadorService: TrabajadorService,
    private reparacionService: ReparacionService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.ordenTrabajoService.getAll().subscribe((data) => {
      this.ordenes = data;
      this.ordenesFiltradas = [...data];
    });

    this.trabajadorService.getAll().subscribe((data) => {
      this.trabajadores = data;
    });
  }

  aplicarFiltros(): void {
    this.ordenesFiltradas = this.ordenes.filter((orden) => {
      const coincideDNI = this.filtroDNI
        ? orden.user?.dni?.toLowerCase().includes(this.filtroDNI.toLowerCase())
        : true;

      const coincideMatricula = this.filtroMatricula
        ? orden.vehiculo?.matricula?.toLowerCase().includes(this.filtroMatricula.toLowerCase())
        : true;

      const coincideTrabajador = this.filtroTrabajadorId
        ? orden.trabajadores?.some((t) => t.id === this.filtroTrabajadorId)
        : true;

      return coincideDNI && coincideMatricula && coincideTrabajador;
    });
  }

  limpiarFiltros(): void {
    this.filtroDNI = '';
    this.filtroMatricula = '';
    this.filtroTrabajadorId = null;
    this.ordenesFiltradas = [...this.ordenes];
  }
  getTrabajadoresNombres(orden: OrdenDeTrabajo): string {
  return orden.trabajadores?.map(t => t.nombreCompleto).join(', ') || 'Sin asignar';
}

getPiezasAgrupadas(orden: OrdenDeTrabajo): string {
  if (!orden.piezas || orden.piezas.length === 0) return 'Sin piezas';

  const mapa = new Map<number, { pieza: Pieza; cantidad: number }>();

  orden.piezas.forEach(pieza => {
    if (!pieza.id) return;
    if (mapa.has(pieza.id)) {
      mapa.get(pieza.id)!.cantidad++;
    } else {
      mapa.set(pieza.id, { pieza, cantidad: 1 });
    }
  });

  return Array.from(mapa.values())
    .map(entry => `${entry.pieza.nombre} (x${entry.cantidad})`)
    .join(', ');
}
finalizarOrdenDeTrabajo(orden: OrdenDeTrabajo): void {
    const ahora = new Date().toISOString();
    const dto: FinalizarOrdenDeTrabajoDTO = {
  id: orden.user.id!,
  fechaFin: new Date().toISOString(),

  ordenDeTrabajoDTO: orden
};// formateado correctamente para LocalDateTime

    console.log('DTO a enviar:', dto);
    this.ordenTrabajoService.establecerFechaFinConDTO(dto)
      .subscribe({
        next: () => {
          alert('Orden finalizada correctamente');
           // Opcional: actualizar estado en UI
           this.cargarDatos();
        },
        error: err => {
          console.error('Error al finalizar la orden', err);
          alert('Error al finalizar la orden');
        }
      });
    }
cambiarEstadoAEnCabina(orden: OrdenDeTrabajo): void {
  if (!orden.id) {
    alert('La orden no tiene un ID válido');
    return;
  }

  if (orden.estadoOrdenDeTrabajo !== 'EN_PROCESO') {
    alert('Solo se puede cambiar el estado si está EN_PROCESO');
    return;
  }

  const nuevoEstado = 'EN_CABINA';

  this.reparacionService.updateEstado(orden.id, nuevoEstado).subscribe({
    next: (reparacionActualizada) => {
      orden.estadoOrdenDeTrabajo = reparacionActualizada.estado; // Asume que viene de la entidad Reparacion
      alert('Estado actualizado a EN_CABINA');
    },
    error: (err) => {
      console.error('Error al cambiar estado:', err);
      alert('No se pudo cambiar el estado');
    }
  });
}


}
