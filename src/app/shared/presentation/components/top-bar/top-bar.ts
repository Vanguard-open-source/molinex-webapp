import { IamStore } from '../../../../identity-access-management/application/iam.store';
import { AuthenticationSection } from '../../../../identity-access-management/presentation/components/authentication-section/authentication-section';
import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  imports: [AuthenticationSection, LanguageSwitcher, MatToolbarModule, TranslatePipe],
  selector: 'app-top-bar',
  styleUrl: './top-bar.css',
  templateUrl: './top-bar.html',
})
export class TopBar {
  protected readonly iam = inject(IamStore);
  readonly menuToggled = output<void>();

  readonly #translate = inject(TranslateService);
  readonly #currentLanguage = toSignal(
    this.#translate.onLangChange.pipe(map((event) => event.lang)),
    { initialValue: this.#translate.getCurrentLang() ?? 'en' },
  );

  protected readonly formattedDate = computed(() =>
    new Intl.DateTimeFormat(this.#currentLanguage() === 'es' ? 'es-PE' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
  );
}
