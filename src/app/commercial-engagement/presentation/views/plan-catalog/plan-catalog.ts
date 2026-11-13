import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { CommercialStore } from '../../../application/commercial.store';
@Component({
  selector: 'app-plan-catalog',
  imports: [RouterLink, MatButtonModule, MatCardModule, TranslatePipe],
  templateUrl: './plan-catalog.html',
  styleUrl: './plan-catalog.css',
})
export class PlanCatalog {
  protected readonly store = inject(CommercialStore);
  protected readonly features = this.store.plans()[2].features;
}
