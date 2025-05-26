import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.init().then(authenticated => {
      this.isLoggedIn = authenticated;
      if (authenticated) {
        this.username = this.authService.getUsername();
      }
    }).catch(() => {
      this.isLoggedIn = false;
    });
  }

  logout() {
    this.authService.logout();
  }
}
