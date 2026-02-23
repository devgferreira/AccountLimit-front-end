import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loading = false;
  error: string | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges(); 

    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();

          if(this.auth.hasRole('ANALISTA_FRAUDE')){
            this.router.navigateByUrl('/limit/search');

          }else{
            this.router.navigateByUrl('/pix/authorize');
            
          }
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;

          if (err?.status === 401) {
            this.error = 'Usuário ou senha inválidos';
          } else {
            this.error =
              err?.error?.error ??
              err?.error?.message ??
              'Falha no login';
          }

          this.cdr.detectChanges(); 
        });
      },
    });
  }
}