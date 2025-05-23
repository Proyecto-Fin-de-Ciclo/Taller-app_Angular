import { Component } from '@angular/core';
import { GestionCitasComponent } from "../features/gestion-citas/gestion-citas.component"; // Importa el componente de gestión de citas

@Component({
  selector: 'app-home',
  standalone: true,             // clave para standalone
  imports: [GestionCitasComponent],                  // aquí importas módulos que uses (p.ej. CommonModule)
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}

