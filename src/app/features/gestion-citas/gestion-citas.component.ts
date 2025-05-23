import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models/cita';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, HttpClientModule],
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css']
})
export class GestionCitasComponent implements OnInit {
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;

  citasPorDia: { [dia: number]: Cita[] } = {};
  diasDelMes: { numero: number; esDeOtroMes: boolean }[] = [];

  dialogVisible = false;
  citaSeleccionada: Cita | null = null;

  constructor(private citaService: CitaService) {}

  ngOnInit() {
    this.cargarCitasDelMes();
  }

  cargarCitasDelMes() {
    const year = this.selectedYear;
    const month = this.selectedMonth;

    const fechaInicio = `${year}-${month.toString().padStart(2, '0')}-01`;
    const ultimoDia = new Date(year, month, 0).getDate();
    const fechaFin = `${year}-${month.toString().padStart(2, '0')}-${ultimoDia.toString().padStart(2, '0')}`;

    this.generarDiasDelMes(year, month);

    this.citaService.getCitasPorRango(fechaInicio, fechaFin).subscribe({
      next: (citas) => this.organizarCitasPorDia(citas),
      error: (err) => {
        console.error('Error cargando citas:', err);
        this.citasPorDia = {};
      }
    });
  }

  generarDiasDelMes(year: number, month: number) {
    const dias: { numero: number; esDeOtroMes: boolean }[] = [];
    const primerDia = new Date(year, month - 1, 1);
    const primerDiaSemana = (primerDia.getDay() + 6) % 7; // lunes=0, domingo=6

    // Días del mes anterior
    const ultimoDiaMesAnterior = new Date(year, month - 1, 0).getDate();
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      dias.push({ numero: ultimoDiaMesAnterior - i, esDeOtroMes: true });
    }

    // Días del mes actual
    const diasEnEsteMes = new Date(year, month, 0).getDate();
    for (let i = 1; i <= diasEnEsteMes; i++) {
      dias.push({ numero: i, esDeOtroMes: false });
    }

    // Días del mes siguiente para completar semanas
    while (dias.length % 7 !== 0) {
      dias.push({ numero: dias.length - diasEnEsteMes + 1, esDeOtroMes: true });
    }

    this.diasDelMes = dias;
  }

  organizarCitasPorDia(citas: Cita[]) {
    this.citasPorDia = {};
    citas.forEach(cita => {
      const dia = new Date(cita.fecha).getDate();
      if (!this.citasPorDia[dia]) {
        this.citasPorDia[dia] = [];
      }
      this.citasPorDia[dia].push(cita);
    });
  }

  onChangeFecha() {
    this.cargarCitasDelMes();
  }

  abrirDetalleCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.dialogVisible = true;
  }

  getCitasDelDia(diaNumero: number): Cita[] {
    return this.citasPorDia[diaNumero] || [];
  }
}
