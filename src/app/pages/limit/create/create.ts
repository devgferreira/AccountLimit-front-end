import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountLimitApiService } from '../../../core/services/accountlimit-api.service';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-limit-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.html',
})
export class LimitCreateComponent {
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
    account: ['', [Validators.required]],
    pixTransactionLimit: [0, [Validators.required, Validators.min(0)]],
  });

  submit() {
    this.message = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.api.createLimit(this.form.getRawValue() as any).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.loading = false;

          if (!res?.isSuccess) {
            this.message = { type: 'error', text: res?.error ?? 'Falha ao criar' };
            this.cdr.detectChanges();
            return;
          }

          this.message = { type: 'success', text: 'Limite criado com sucesso.' };
          this.form.reset({ pixTransactionLimit: 0 });

          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;

          const msg =
            err?.error?.error ??
            err?.error?.message ??
            'Falha ao criar';

          this.message = { type: 'error', text: msg };

          this.cdr.detectChanges();
        });
      },
    });
  }
}