import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export interface KebabMenuItem {
  id: string;
  label: string;
}

@Component({
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  selector: 'app-kebab-menu',
  styleUrl: './kebab-menu.scss',
  templateUrl: './kebab-menu.html',
})
export class KebabMenu {
  readonly items = input.required<KebabMenuItem[]>();
  readonly ariaLabel = input('Actions');
  readonly action = output<string>();

  protected onSelect(id: string): void {
    this.action.emit(id);
  }
}
