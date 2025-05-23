import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component'; // crea este componente si no existe

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },  // ruta protegida con AuthGuard
  { path: '', redirectTo: 'home', pathMatch: 'full' },                   // ruta por defecto
  { path: '**', redirectTo: 'home' }                                     // ruta fallback para todo lo demás
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
