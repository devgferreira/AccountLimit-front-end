import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountLimitApiService } from '../../../core/services/accountlimit-api.service';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-limit-delete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delete.html',
})
export class LimitDeleteComponent {
  private fb = inject(FormBuilder);
  private api = inject(AccountLimitApiService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  constructor(public authService: AuthService) {}
  loading = false;
  message: { type: 'success' | 'error'; text: string } | null = null;

  form = this.fb.group({
    cpf: ['', [Validators.required]],
    agency: ['', [Validators.required]],
  });

  submit() {
    this.message = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const ok = confirm('Tem certeza que deseja deletar este limite?');
    if (!ok) return;

    this.loading = true;
    this.cdr.detectChanges();

    const { cpf, agency } = this.form.getRawValue() as any;

    this.api.deleteLimit(cpf, agency).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.loading = false;

          if (!res?.isSuccess) {
            this.message = { type: 'error', text: res?.error ?? 'Falha ao deletar' };
            this.cdr.detectChanges();
            return;
          }

          this.message = { type: 'success', text: 'Limite deletado com sucesso.' };
          this.form.reset();

          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;

          const msg =
            err?.error?.error ??
            err?.error?.message ??
            'Erro de rede.';

          this.message = { type: 'error', text: msg };

          this.cdr.detectChanges();
        });
      },
    });
  }
}