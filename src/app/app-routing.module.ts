import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionCitasComponent } from './features/gestion-citas/gestion-citas.component';
import { CompaniasComponent } from './features/companias/companias.component';
import { PiezasComponent } from './features/piezas/piezas.component';
import { ReparacionesComponent } from './features/reparacion/reparacion.component';
import { TrabajadorComponent } from './features/trabajador/trabajador.component';
import { VehiculoComponent } from './features/vehiculo/vehiculo.component';
import { UserComponent } from './features/user/user.component';
import { OrdenesTrabajoComponent } from './features/orden-de-trabajo/orden-de-trabajo.component';
import { PresupuestoComponent } from './features/presupuesto/presupuesto.component';
import { EstadoReparacionClienteComponent } from './features/seguimiento-reparacion/seguimiento-reparacion.component';
import { ClienteDashboardComponent } from './features/cliente-dashboard/cliente-dashboard.component';
import { TrabajadorDashboardComponent } from './features/trabajador-dahsboard/trabajador-dahsboard.component';


const routes: Routes = [


  { path: 'cita', component: GestionCitasComponent },
  { path: 'ordenDeTrabajo', component: OrdenesTrabajoComponent }, // Ruta para editar una cita
  { path: 'presupuesto', component:PresupuestoComponent},
  { path: 'compania', component: CompaniasComponent },
  { path: 'pieza', component: PiezasComponent },
  { path: 'reparacion', component: ReparacionesComponent },
  { path: 'trabajador', component: TrabajadorComponent },
  { path: 'vehiculo', component: VehiculoComponent },
  { path: 'seguimiento-reparacion', component:EstadoReparacionClienteComponent},
  { path: 'cliente-dashboard', component: ClienteDashboardComponent},
  { path: 'trabajador-dashboard', component: TrabajadorDashboardComponent},
  { path: 'user', component: UserComponent },
  { path: '', redirectTo: 'cita', pathMatch: 'full' },
  { path: '**', redirectTo: 'cita' }
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',        // Ignora navegaciones a la misma ruta (incluye fragmentos)
      anchorScrolling: 'enabled',            // Permite scroll automático si la URL tiene fragmento (#algo)
      scrollPositionRestoration: 'enabled', // Restaura la posición del scroll cuando navegas atrás/adelante
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
