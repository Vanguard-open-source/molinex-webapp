import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { CommercialStore } from '../../../application/commercial.store';
@Component({
  selector: 'app-value-proposition',
  imports: [RouterLink, MatButtonModule, MatCardModule, TranslatePipe],
  templateUrl: './value-proposition.html',
  styleUrl: './value-proposition.css',
})
export class ValuePropositionView {
  protected readonly store = inject(CommercialStore);
}
