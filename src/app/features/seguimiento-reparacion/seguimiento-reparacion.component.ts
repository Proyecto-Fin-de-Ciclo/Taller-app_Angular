import { CitaService } from './../../core/services/cita.service';
import { Component, OnInit } from '@angular/core';
import { ReparacionService } from '../../core/services/reparacion.service';
import { Reparacion } from '../../core/models/reparacion';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service.service';
import { UserService } from '../../core/services/user.service';
import autoTable from 'jspdf-autotable';
import { Presupuesto } from '../../core/models/presupuesto';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-estado-reparacion-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './seguimiento-reparacion.component.html',
  styleUrls: ['./seguimiento-reparacion.component.css']
})
export class EstadoReparacionClienteComponent implements OnInit {
  reparaciones: Reparacion[] = [];
  userId = 1;

  constructor(private reparacionService: ReparacionService , private authService: AuthService,
  private userService: UserService,private citaService : CitaService) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();
  if (username) {
    this.citaService.getUserByUsername(username).subscribe({
      next: (user) => {
        if (user && user.id) {
          this.cargarReparaciones(user.id);
        } else {
          console.error('Usuario no encontrado o sin ID');
        }
      },
      error: (err) => console.error('Error al obtener usuario:', err)
    });
  } else {
    console.error('No se pudo obtener el nombre de usuario desde AuthService');
  }
}


  cargarReparaciones(userId: number): void {
  this.reparacionService.getReparacionesPorCliente(userId).subscribe({
    next: (data) => {
      this.reparaciones = data;
    },
    error: (err) => {
      console.error('Error al obtener reparaciones', err);
    }
  });
}


  obtenerImagen(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return '/assets/pendiente.png';
      case 'EN_PROCESO':
        return '/assets/proceso.png';
      case 'EN_CABINA':
        return '/assets/cabina.png';
      case 'FINALIZADA':
        return '/assets/finalizado.png';
      default:
        return '/assets/default.jpg';
    }
  }

  esEstadoActual(rep: Reparacion, estado: string): boolean {
    return rep.estado?.trim().toUpperCase() === estado.toUpperCase();
  }

  todosLosEstados = [
    'PENDIENTE',
    'EN_PROCESO',
    'EN_CABINA',
    'FINALIZADA'
  ];

  generarFacturaPDF(presupuesto: Presupuesto): void {
  const doc: any = new jsPDF();

  const fecha = new Date();
  const numeroFactura = `FAC-${fecha.getFullYear()}${fecha.getMonth() + 1}${fecha.getDate()}-${fecha.getTime()}`;

  // Encabezado
  doc.setFontSize(16);
  doc.text('FACTURA', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Factura Nº: ${numeroFactura}`, 14, 30);
  doc.text(`Fecha: ${fecha.toLocaleDateString()}`, 14, 36);

  // Datos del taller
  doc.setFontSize(12);
  doc.text(`Taller: TuTaller-APP`, 14, 46);
  doc.text(`Dirección: Calle Falsa 123`, 14, 52);
  doc.text(`Teléfono: 600123456`, 14, 58);

  // Datos del cliente
  const cliente = presupuesto.vehiculo.propietario;
  doc.text(`Cliente: ${cliente.nombre} ${cliente.apellidos}`, 14, 68);
  doc.text(`DNI: ${cliente.dni}`, 14, 74);
  doc.text(`Vehículo: ${presupuesto.vehiculo.marca} ${presupuesto.vehiculo.modelo} (${presupuesto.vehiculo.matricula})`, 14, 80);

  // Descripción del trabajo
  doc.setFontSize(12);
  doc.text(`Descripción del trabajo:`, 14, 90);
  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(presupuesto.descripcionTrabajo || 'N/A', 180), 14, 96);

  // Agrupar piezas/servicios
  const piezasAgrupadas: { nombre: string; cantidad: number; precio: number }[] = [];

  (presupuesto.piezas ?? []).forEach(p => {
    const existente = piezasAgrupadas.find(x => x.nombre === p.nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      piezasAgrupadas.push({ nombre: p.nombre, cantidad: 1, precio: p.precio });
    }
  });

  // Tabla de piezas/servicios
  const tablaY = 106 + (presupuesto.descripcionTrabajo?.length || 0) / 2;
  autoTable(doc, {
    startY: tablaY,
    head: [['Concepto', 'Cantidad', 'Precio Unitario', 'Total']],
    body: piezasAgrupadas.map(p => [
      p.nombre,
      p.cantidad,
      `${p.precio.toFixed(2)} €`,
      `${(p.precio * p.cantidad).toFixed(2)} €`
    ]),
  });

  // Totales
  const subtotal = presupuesto.subtotalPiezas;
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const posY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Subtotal: ${subtotal.toFixed(2)} €`, 150, posY);
  doc.text(`IVA (21%): ${iva.toFixed(2)} €`, 150, posY + 6);
  doc.text(`TOTAL: ${total.toFixed(2)} €`, 150, posY + 12);

  // Pie
  doc.setFontSize(10);
  doc.text('Gracias por confiar en TuTaller-APP.', 14, posY + 30);

  doc.save(`factura_${cliente.apellidos}_${presupuesto.vehiculo.matricula}.pdf`);
}


}
