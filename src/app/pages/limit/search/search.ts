import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountLimitApiService } from '../../../core/services/accountlimit-api.service';
import { LimitManagementDTO } from '../../../core/models/accountlimit.models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-limit-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.html',
})
export class LimitSearchComponent {
  private fb = inject(FormBuilder);
  private api = inject(AccountLimitApiService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  constructor(public authService: AuthService) {}

  loading = false;
  message: { type: 'success' | 'error'; text: string } | null = null;
  results: LimitManagementDTO[] = [];

  form = this.fb.group({
    cpf: ['', [Validators.required]],
    agency: [''],
  });

  submit() {
    this.message = null;
    this.results = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const cpf = this.form.value.cpf!;
    const agency = this.form.value.agency || null;

    this.api.getLimits({ cpf, agency }).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.loading = false;

          if (!res?.isSuccess) {
            this.message = { type: 'error', text: res?.error ?? 'Falha ao buscar' };
            this.cdr.detectChanges();
            return;
          }

          this.results = res.value ?? [];

          if (this.results.length === 0) {
            this.message = { type: 'success', text: 'Nenhum resultado.' };
          }

          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;

          const msg =
            err?.error?.error ??
            err?.error?.message ??
            'Erro.';

          this.message = { type: 'error', text: msg };

          this.cdr.detectChanges();
        });
      },
    });
  }
}