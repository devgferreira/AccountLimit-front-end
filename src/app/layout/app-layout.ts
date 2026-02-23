import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.css'],
})
export class AppLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  constructor(public authService: AuthService) {}

  logout() {
    this.auth.logout(); 
    this.router.navigateByUrl('/login');
  }
}