import { Component, ElementRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CommercialStore } from '../../../application/commercial.store';
@Component({
  selector: 'app-commercial-inquiry-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './commercial-inquiry-form.html',
  styleUrl: './commercial-inquiry-form.css',
})
export class CommercialInquiryForm {
  protected readonly store = inject(CommercialStore);
  readonly #element = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    fullName: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    companyName: ['', [Validators.required, Validators.pattern(/\S/)]],
    message: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  protected submit(): void {
    if (this.store.loading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.#element.nativeElement
        .querySelector<HTMLElement>('input.ng-invalid, textarea.ng-invalid')
        ?.focus();
      return;
    }
    const value = this.form.getRawValue();
    this.store.submit({ ...value, phoneNumber: value.phoneNumber || null }).subscribe({
      next: () =>
        this.#element.nativeElement.querySelector<HTMLElement>('[role="status"]')?.focus(),
      error: () =>
        this.#element.nativeElement.querySelector<HTMLElement>('[role="alert"]')?.focus(),
    });
  }
}
