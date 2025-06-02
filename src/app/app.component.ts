import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth/auth-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],


})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  username?: string;
  roles: string[] = [];

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.authService.init().then(authenticated => {
      this.isLoggedIn = authenticated;
      if (authenticated) {
        this.username = this.authService.getUsername();
         this.roles = this.authService.getRoles();
        const userInfo = this.authService.getUserInfo();
        console.info(userInfo)
        console.info(this.authService.getRoles())

        // Redirige según el rol
      if (this.hasRole('admin')) {
        this.router.navigate(['/cita']);
      } else if (this.hasRole('cliente')) {
        this.router.navigate(['/cliente-dashboard']);
      } else if (this.hasRole('trabajador')) {
        this.router.navigate(['/trabajador-dashboard']);
      }
      }
    }).catch(() => {
      this.isLoggedIn = false;
    });
  }

  logout() {
    this.authService.logout();
  }
  // Método para verificar roles
hasRole(role: string): boolean {
  return this.roles.includes(role);
}
}
