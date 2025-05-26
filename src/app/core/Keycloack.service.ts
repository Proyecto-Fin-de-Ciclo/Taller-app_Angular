// src/app/services/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'master',
      clientId: 'angular-client'
    });
  }

  init(): Promise<boolean> {
  return this.keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    redirectUri: window.location.origin + '/home'
  }).then(authenticated => {
    return authenticated;
  });
}


  getToken(): string | undefined {
    return this.keycloak.token;
  }

  logout() {
    this.keycloak.logout();
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }
}
