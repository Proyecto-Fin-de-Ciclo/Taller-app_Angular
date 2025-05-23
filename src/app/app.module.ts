import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptors';
import { GestionCitasComponent } from './features/gestion-citas/gestion-citas.component';
import { CompaniasComponent } from './features/companias/companias.component';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppComponent,
    LoginComponent,
    HomeComponent,
    GestionCitasComponent,
    CompaniasComponent
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
})
export class AppModule { }

