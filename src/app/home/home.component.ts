import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // 👈 Importa esto
import { GestionCitasComponent } from '../features/gestion-citas/gestion-citas.component';
import { CompaniasComponent } from "../features/companias/companias.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    CompaniasComponent,
    GestionCitasComponent], // 👈 Añádelo aquí
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
