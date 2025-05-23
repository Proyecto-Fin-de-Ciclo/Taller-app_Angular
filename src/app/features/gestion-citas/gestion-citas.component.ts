import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';          // <--- Importa FormsModule
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models/cita';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [FormsModule],     // <--- Añade FormsModule aquí
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css']
})
export class GestionCitasComponent implements OnInit {

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;

  citasPorDia: { [dia: number]: Cita[] } = {};

  constructor(private citaService: CitaService) {}

  ngOnInit() {
    this.loadCitas(this.selectedYear, this.selectedMonth);
  }

  loadCitas(year: number, month: number) {
    const fechaInicio = `${year}-${month.toString().padStart(2, '0')}-01`;
    const ultimoDia = new Date(year, month, 0).getDate();
    const fechaFin = `${year}-${month.toString().padStart(2, '0')}-${ultimoDia}`;

    this.citaService.getCitasPorRango(fechaInicio, fechaFin).subscribe({
      next: citas => {
        this.organizarCitasPorDia(citas);
      },
      error: err => {
        console.error('Error cargando citas:', err);
        this.citasPorDia = {};
      }
    });
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
    this.loadCitas(this.selectedYear, this.selectedMonth);
  }
}
