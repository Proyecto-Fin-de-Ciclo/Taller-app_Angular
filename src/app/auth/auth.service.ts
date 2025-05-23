import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak?: Keycloak;
  private loggedIn = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // 🔄 Cierra sesión cuando se cierra el navegador (opcional)
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('beforeunload', () => {
        this.logout();
      });
    }
  }

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve(false);
        return;
      }

      // 🧼 Limpiar almacenamiento previo
      //sessionStorage.clear();
      //localStorage.clear();

      this.keycloak = new Keycloak({
        url: 'http://localhost:8080', // Ajusta si tu Keycloak está en otro puerto o dominio
        realm: 'Taller-Realm',
        clientId: 'frontend-angular'
      });

      this.keycloak.init({
        onLoad: 'login-required', // 🔥 Siempre fuerza pantalla de login
        checkLoginIframe: false,  // Opcional: desactiva verificación por iframe
        // silentCheckSsoRedirectUri solo es necesario si usas check-sso
        // silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      })
      .then(authenticated => {
        this.loggedIn = authenticated;
        resolve(authenticated);
      })
      .catch(() => {
        this.loggedIn = false;
        reject();
      });
    });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsername(): string | undefined {
    if (!this.keycloak) return undefined;
    return (this.keycloak.tokenParsed as any)?.preferred_username;
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  login(): void {
    this.keycloak?.login();
  }

  logout(): void {
    this.keycloak?.logout({ redirectUri: window.location.origin });
  }
}
