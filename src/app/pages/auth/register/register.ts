import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;
  success: string | null = null;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.error = null;
    this.success = null;

    if (this.form.invalid) return;

    this.loading = true;

    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Conta criada com sucesso! Redirecionando...';
        setTimeout(() => this.router.navigateByUrl('/login'), 700);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Falha ao registrar';
      },
    });
  }
}