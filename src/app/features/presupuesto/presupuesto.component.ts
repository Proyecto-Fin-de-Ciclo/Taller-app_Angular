import { CitaService } from './../../core/services/cita.service';
// src/app/components/presupuesto/presupuesto.component.ts

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Presupuesto } from '../../core/models/presupuesto';
import { PresupuestoService } from '../../core/services/presupuesto.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth-service.service';


@Component({
  selector: 'app-presupuesto',
    standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css']
})
export class PresupuestoComponent implements OnInit {
  @Output() presupuestoSeleccionado = new EventEmitter<Presupuesto>();

  presupuestos: Presupuesto[] = [];
  filteredPresupuestos: Presupuesto[] = [];

  dniFiltro: string = '';
  matriculaFiltro: string = '';

  constructor(private presupuestoService: PresupuestoService,private authService: AuthService,private CitaService: CitaService) {}

ngOnInit(): void {
  setTimeout(() => {
  const username = this.authService.getUsername();
  const roles = this.authService.getRoles();
  console.log(username);
  console.log(roles);

  if (!username || roles.length === 0) {
    console.error('Usuario no autenticado o sin roles');
    return;
  }

  if (roles.includes('admin')) {
    this.cargarTodosPresupuestos();
  } else if (roles.includes('cliente')) {
    this.presupuestoService.getAll().subscribe(data => {

      console.log('Presupuestos totales:', data);
  console.log('Username logueado:', username);

  const presupuestosCliente = data.filter(p =>
    p.vehiculo?.propietario?.nombreUsuarioApp === username
  );

  console.log('Presupuestos filtrados:', presupuestosCliente);
      this.presupuestos = presupuestosCliente;
      this.filteredPresupuestos = [...presupuestosCliente];
    });
  }
}, 500); // este retraso depende de tu red y servidor, por eso es inestable
}

aprobarPresupuesto(p: Presupuesto): void {
  if (!p.vehiculo || !p.piezas || p.piezas.length === 0) {
    alert('Faltan datos obligatorios para aprobar el presupuesto');
    return;
  }
  console.log('Aprobando presupuesto:', p);
  const presupuestoParaBackend: any = {
    ...p,
    aceptado: true,


  };

  // Eliminar propiedades no necesarias para el backend


console.log('Aprobando presupuesto:', presupuestoParaBackend);
  this.presupuestoService.update(presupuestoParaBackend).subscribe({
    next: () => {
      // Marcamos aceptado en frontend
      p.aceptado = true;

    },
    error: (err) => {
      console.error('Error actualizando presupuesto:', err);
      alert('Error actualizando presupuesto');
    }
  });
}



generarPDF(presupuesto: Presupuesto): void {
  const doc:any = new jsPDF();

  // Datos del cliente y taller
  doc.setFontSize(16);
  doc.text('Presupuesto de Reparación', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Taller: TuTaller-APP`, 14, 30);
  doc.text(`Dirección: Calle Falsa 123`, 14, 36);
  doc.text(`Teléfono: 600123456`, 14, 42);

  doc.text(`Cliente: ${presupuesto.vehiculo.propietario.nombre} ${presupuesto.vehiculo.propietario.apellidos}`, 14, 52);
  doc.text(`DNI: ${presupuesto.vehiculo.propietario.dni}`, 14, 58);
  doc.text(`Matrícula: ${presupuesto.vehiculo.matricula}`, 14, 64);

  doc.text(`Trabajo: ${presupuesto.descripcionTrabajo}`, 14, 74);

  // Agrupar piezas
  const piezasAgrupadas: { nombre: string; cantidad: number; precio: number }[] = [];

  (presupuesto.piezas ?? []).forEach(p => {
    const existente = piezasAgrupadas.find(x => x.nombre === p.nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      piezasAgrupadas.push({ nombre: p.nombre, cantidad: 1, precio: p.precio });
    }
  });

  // Tabla de piezas
  autoTable(doc, {
    startY: 84,
    head: [['Pieza', 'Cantidad', 'Precio Unitario', 'Total']],
    body: piezasAgrupadas.map(p => [
      p.nombre,
      p.cantidad,
      `${p.precio.toFixed(2)} €`,
      `${(p.precio * p.cantidad).toFixed(2)} €`
    ]),
  });

  // Totales
  const totalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: ${presupuesto.subtotalPiezas.toFixed(2)} €`, 14, totalY);
  doc.text(`Total con IVA: ${presupuesto.totalConIVA.toFixed(2)} €`, 14, totalY + 6);

  doc.save(`presupuesto_${presupuesto.vehiculo.matricula}.pdf`);
}



  filtrar(): void {
    this.filteredPresupuestos = this.presupuestos.filter(p => {
      const dniOk = this.dniFiltro ? p.vehiculo.propietario?.dni?.includes(this.dniFiltro) : true;
      const matOk = this.matriculaFiltro ? p.vehiculo.matricula?.includes(this.matriculaFiltro) : true;
      return dniOk && matOk;
    });
  }
  cargarPresupuestos(): void {
  this.presupuestoService.getAll().subscribe(data => {
    console.log('Presupuestos cargados:', data);

    this.presupuestos = data.map(p => ({
      ...p,
      vehiculo: p.vehiculo
    }));

    this.filteredPresupuestos = [...this.presupuestos];
  });
}
cargarTodosPresupuestos(): void {
  this.presupuestoService.getAll().subscribe(data => {
    this.presupuestos = data;
    this.filteredPresupuestos = [...data];
  });
}

}
