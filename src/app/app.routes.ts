import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { GestionCitasComponent } from './features/gestion-citas/gestion-citas.component';
import { CompaniasComponent } from "./features/companias/companias.component";
import { PiezasComponent } from './features/piezas/piezas.component';
import { ReparacionesComponent } from './features/reparacion/reparacion.component';
import { TrabajadorComponent } from './features/trabajador/trabajador.component';
import { UserComponent } from './features/user/user.component';
import { VehiculoComponent } from './features/vehiculo/vehiculo.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cita', component: GestionCitasComponent },
  { path: 'compania', component: CompaniasComponent },
  { path: 'pieza', component: PiezasComponent },
  { path: 'reparacion', component: ReparacionesComponent },
  { path: 'trabajador', component: TrabajadorComponent },
  { path: 'vehiculo', component: VehiculoComponent },
  { path: 'user', component: UserComponent },
  { path: '', redirectTo: 'cita', pathMatch: 'full' },
  { path: '**', redirectTo: 'cita' }
];


