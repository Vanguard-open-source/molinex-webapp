import { FooterContent } from '../footer-content/footer-content';
import { IamStore } from '../../../../identity-access-management/application/iam.store';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NavigationGroup, SideNavigation } from '../side-navigation/side-navigation';
import { TopBar } from '../top-bar/top-bar';

@Component({
  imports: [FooterContent, RouterOutlet, SideNavigation, TopBar, TranslatePipe],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly iam = inject(IamStore);
  protected readonly navigationOpen = signal(false);

  protected readonly options = computed<readonly NavigationGroup[]>(() =>
    [
      {
        label: 'navigation.groups.plant',
        items: [
          { icon: 'conveyor_belt', label: 'navigation.items.operations', path: '/production' },
          { icon: 'fact_check', label: 'navigation.items.quality', path: '/quality' },
        ],
      },
      {
        label: 'navigation.groups.assets',
        items: [
          {
            icon: 'precision_manufacturing',
            label: 'navigation.items.machinery',
            path: '/assets/machinery',
          },
          {
            icon: 'build_circle',
            label: 'navigation.items.maintenance',
            path: '/assets/maintenance',
          },
        ],
      },
    ]
      .filter((group) =>
        group.label === 'navigation.groups.plant'
          ? this.iam.hasRole('administrator', 'operator')
          : this.iam.hasRole('administrator', 'technician'),
      )
      .concat(
        this.iam.hasRole('administrator')
          ? [
              {
                label: 'navigation.groups.administration',
                items: [
                  { icon: 'manage_accounts', label: 'navigation.items.users', path: '/iam/users' },
                ],
              },
            ]
          : [],
      ),
  );

  protected closeNavigation(): void {
    this.navigationOpen.set(false);
  }

  protected toggleNavigation(): void {
    this.navigationOpen.update((isOpen) => !isOpen);
  }
}
