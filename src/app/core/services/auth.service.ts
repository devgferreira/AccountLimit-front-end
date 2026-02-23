import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.authApiBaseUrl;

  private readonly tokenKey = 'access_token';
  private readonly expiresAtKey = 'expires_at';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // --- helpers SSR-safe ---
  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/api/auth/login`, payload).pipe(
      tap(res => {
        const s = this.storage;
        if (!s) return; // SSR: não salva

        s.setItem(this.tokenKey, res.accessToken);
        s.setItem(this.expiresAtKey, new Date(res.expiresAt).toISOString());
      })
    );
  }

  register(payload: RegisterRequest) {
    return this.http.post<void>(`${this.base}/api/auth/register`, payload);
  }

  logout() {
    const s = this.storage;
    if (!s) return;

    s.removeItem(this.tokenKey);
    s.removeItem(this.expiresAtKey);
  }

  getToken(): string | null {
    const s = this.storage;
    return s ? s.getItem(this.tokenKey) : null;
  }

  isAuthenticated(): boolean {
    const s = this.storage;
    if (!s) return false;

    const token = s.getItem(this.tokenKey);
    const expiresAt = s.getItem(this.expiresAtKey);
    if (!token || !expiresAt) return false;

    const expMs = Date.parse(expiresAt);
    if (Number.isNaN(expMs)) return false;

    return Date.now() < expMs;
  }

  getUserRole(): string | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;

    const role =
      decoded.role ??
      decoded.roles ??
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      decoded['roles'] ??
      null;

    if (Array.isArray(role)) return role[0] ?? null;

    return typeof role === 'string' ? role : null;
  }

  hasRole(role: string): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return false;

    const raw =
      decoded.role ??
      decoded.roles ??
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      null;

    if (Array.isArray(raw)) return raw.includes(role);
    if (typeof raw === 'string') return raw === role;

    return false;
  }
}