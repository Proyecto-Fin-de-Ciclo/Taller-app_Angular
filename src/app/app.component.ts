import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router'; // <-- importar router
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],  // <-- importar RouterModule para usar router-outlet
  template: `
    <div *ngIf="isLoggedIn; else notLogged">
      <p>Bienvenido, {{ username }}</p>
      <button (click)="logout()">Salir</button>
    </div>
    <ng-template #notLogged>
      <p>No estás logueado</p>
    </ng-template>

    <router-outlet></router-outlet>  <!-- Aquí se carga la ruta activa -->
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  username?: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.init()
      .then(authenticated => {
        this.isLoggedIn = authenticated;
        if (authenticated) {
          this.username = this.authService.getUsername();
        }
      })
      .catch(() => {
        this.isLoggedIn = false;
      });
  }

  logout() {
    this.authService.logout();
  }
}
