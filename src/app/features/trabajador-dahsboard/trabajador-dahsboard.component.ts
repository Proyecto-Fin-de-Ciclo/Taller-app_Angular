import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trabajador } from '../../core/models/trabajador';
import { TrabajadorService } from '../../core/services/trabajador.service';
import { AuthService } from '../../auth/auth-service.service';
import { OrdenDeTrabajoService } from '../../core/services/ordenDeTrabajoService';
import { OrdenDeTrabajo } from '../../core/models/ordenDeTrabajo';
import { FinalizarOrdenDeTrabajoDTO } from '../../core/models/finalizarOrdenDeTrabajo';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { Presupuesto } from '../../core/models/presupuesto';

@Component({
  selector: 'app-trabajador-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trabajador-dahsboard.component.html',
  styleUrls: ['./trabajador-dahsboard.component.css']
})
export class TrabajadorDashboardComponent implements OnInit {
  trabajador: Trabajador | null = null;
  ordenes: OrdenDeTrabajo[] = [];

  constructor(
    private authService: AuthService,
    private trabajadorService: TrabajadorService,
    private ordenTrabajoService: OrdenDeTrabajoService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
    const username = this.authService.getUsername();

    if (!username) {
      console.error('No se encontró el nombre de usuario');
      return;
    }

    // ✅ Usar el nuevo endpoint por nombreUsuarioApp
    this.trabajadorService.getByNombreUsuarioApp(username).subscribe({
      next: (trabajador) => {
        this.trabajador = trabajador;
        if (trabajador?.id) {
this.cargarOrdenes(trabajador.id);
        }
      },
      error: (err) => {
        console.error('Error al obtener trabajador por username:', err);
      }
    });
  }, 500); // este retraso depende de tu red y servidor, por eso es inestable
}
    cargarOrdenes(trabajadorId: number): void {
    this.ordenTrabajoService.getByTrabajadorId(trabajadorId).subscribe({
      next: (data) => this.ordenes = data,
      error: (err) => console.error('Error cargando órdenes:', err)
    });
  }


  getImagenUrl(nombreImagen: string | undefined): string {
    return nombreImagen
      ? this.trabajadorService.getImagen(nombreImagen)
      : 'assets/images/default.png';
  }
getNombresPiezas(orden: OrdenDeTrabajo): string {
  if (!orden.piezas || orden.piezas.length === 0) {
    return 'Sin piezas';
  }

  return orden.piezas.map(p => p.nombre).join(', ');
}
finalizarOrdenDeTrabajo(orden: OrdenDeTrabajo): void {
  if (!orden.user?.id) {
    alert('El usuario asociado a la orden no tiene ID');
    return;
  }

  const dto: FinalizarOrdenDeTrabajoDTO = {
    id: orden.user.id,
    fechaFin: new Date().toISOString(),
    ordenDeTrabajoDTO: orden
  };

  this.ordenTrabajoService.establecerFechaFinConDTO(dto).subscribe({
    next: () => {
      alert('Orden finalizada correctamente');
      // Recargar la lista
      if (this.trabajador?.id) {
        this.cargarOrdenes(this.trabajador.id);
      }
    },
    error: (err) => {
      console.error('Error al finalizar la orden', err);
      alert('Hubo un error al finalizar la orden');
    }
  });
}



}
