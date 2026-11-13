import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { iamErrorKey } from '../../../infrastructure/iam-error';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  protected readonly store = inject(IamStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #element = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly error = signal<string | null>(null);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.store.loading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.#element.nativeElement.querySelector<HTMLElement>('input.ng-invalid')?.focus();
      return;
    }
    this.error.set(null);
    this.store.signIn(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.controls.password.reset();
        const requested = this.#route.snapshot.queryParamMap.get('returnUrl');
        const safe =
          requested &&
          /^(?:\/(production|quality|assets)(\/|$|\?)|\/iam\/users(?:$|\?))/.test(requested);
        void this.#router.navigateByUrl(safe ? requested : this.store.homeRoute());
      },
      error: (error: unknown) => {
        this.error.set(iamErrorKey(error));
        this.#element.nativeElement.querySelector<HTMLElement>('[role="alert"]')?.focus();
      },
    });
  }
}
