import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountLimitApiService } from '../../../core/services/accountlimit-api.service';

@Component({
  selector: 'app-pix-authorize',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authorize.html',
})
export class PixAuthorizeComponent {
  private fb = inject(FormBuilder);
  private api = inject(AccountLimitApiService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  loading = false;
  message: { type: 'success' | 'error'; text: string } | null = null;
  responseJson: any = null;

  form = this.fb.group({
    payerCpf: ['', [Validators.required]],
    payerAgency: ['', [Validators.required]],
    payerAccount: ['', [Validators.required]],
    receiverCpf: ['', [Validators.required]],
    receiverAgency: ['', [Validators.required]],
    receiverAccount: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
  });

  submit() {
    this.message = null;
    this.responseJson = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const payload = {
      ...this.form.getRawValue(),
      transactionDate: new Date().toISOString(),
    };

    this.api.authorizeTransaction(payload as any).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.loading = false;
          this.responseJson = res;

          const value = res?.value;

          if (value) {
            if (value.isAuthorized === true) {
              this.message = {
                type: 'success',
                text: `Transação aprovada. Limite atual: ${value.limitActual}`
              };
            } else if (value.isAuthorized === false) {
              this.message = {
                type: 'error',
                text: `Transação negada. Limite disponível: ${value.limitActual}`
              };
            } else {
              this.message = {
                type: 'error',
                text: res?.error ?? 'Operação não autorizada.'
              };
            }

            this.cdr.detectChanges();
            return;
          }

          this.message = {
            type: 'error',
            text: res?.error ?? 'Erro na operação.'
          };

          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;

          const value = err.error?.value;

          if (value) {
            if (value.isAuthorized === true) {
              this.message = {
                type: 'success',
                text: `Transação aprovada. Limite atual: ${value.limitActual}`
              };
            } else if (value.isAuthorized === false) {
              this.message = {
                type: 'error',
                text: `Transação negada. Limite disponível: ${value.limitActual}`
              };
            } else {
              this.message = {
                type: 'error',
                text: err?.error ?? 'Operação não autorizada.'
              };
            }

            this.cdr.detectChanges();
          }
        });
      },
    });
  }
}