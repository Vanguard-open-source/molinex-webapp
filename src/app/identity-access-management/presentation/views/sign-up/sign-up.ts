import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { iamErrorKey } from '../../../infrastructure/iam-error';
import { MatSelectModule } from '@angular/material/select';
import { ROLES, Role } from '../../../domain/model/role';
import { User } from '../../../domain/model/user.entity';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  protected readonly store = inject(IamStore);
  readonly #element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly formDirective = viewChild(FormGroupDirective);
  protected readonly roles = ROLES;
  protected readonly error = signal<string | null>(null);
  protected readonly created = signal<User | null>(null);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    fullName: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['operator' as Role, Validators.required],
  });

  protected submit(): void {
    if (this.store.loading()) return;
    this.created.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.#element.nativeElement
        .querySelector<HTMLElement>('input.ng-invalid, mat-select.ng-invalid')
        ?.focus();
      return;
    }
    this.error.set(null);
    const value = this.form.getRawValue();
    this.store
      .signUp({
        fullName: value.fullName,
        email: value.email,
        password: value.password,
        roles: [value.role],
      })
      .subscribe({
        next: (user) => {
          this.created.set(user);
          this.formDirective()?.resetForm({
            fullName: '',
            email: '',
            password: '',
            role: 'operator',
          });
          this.#element.nativeElement.querySelector<HTMLElement>('[role="status"]')?.focus();
        },
        error: (error: unknown) => {
          this.error.set(iamErrorKey(error));
          this.#element.nativeElement.querySelector<HTMLElement>('[role="alert"]')?.focus();
        },
      });
  }
}
