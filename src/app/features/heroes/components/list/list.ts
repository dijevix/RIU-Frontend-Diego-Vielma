import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DrawerShell } from '../../../../core/components/drawer/drawer';
import { Input } from '../../../../core/components/input/input';
import { HeroForm } from '../hero-form/hero-form';
import { HeroTable } from '../hero-table/hero-table';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  imports: [DrawerShell, HeroForm, HeroTable, Input, MatButtonModule],
  selector: 'app-list',
  styleUrl: './list.scss',
  templateUrl: './list.html',
})
export class List {
  private searchTimer: ReturnType<typeof setTimeout> | undefined;
  readonly opened = signal(false);
  readonly term = signal('');

  open(): void {
    this.opened.set(true);
  }

  close(): void {
    this.opened.set(false);
  }

  onSearch(value: string): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.term.set(value), SEARCH_DEBOUNCE_MS);
  }
}
