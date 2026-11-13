import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
@Component({
  selector: 'app-authentication-section',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './authentication-section.html',
  styleUrl: './authentication-section.css',
})
export class AuthenticationSection {
  protected readonly store = inject(IamStore);
  readonly #router = inject(Router);
  protected signOut(): void {
    this.store.signOut();
    void this.#router.navigate(['/iam/sign-in']);
  }
}
