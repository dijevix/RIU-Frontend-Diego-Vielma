import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DrawerShell } from '../../../../core/components/drawer/drawer';
import { Input } from '../../../../core/components/input/input';
import { Hero } from '../../models/hero.model';
import { HeroForm } from '../hero-form/hero-form';
import { HeroTable } from '../hero-table/hero-table';

@Component({
  imports: [DrawerShell, HeroForm, HeroTable, Input, MatButtonModule],
  selector: 'app-list',
  styleUrl: './list.scss',
  templateUrl: './list.html',
})
export class List {
  readonly opened = signal(false);
  readonly activeHero = signal<Hero | null>(null);
  readonly term = signal('');
  readonly title = computed(() => (this.activeHero() ? 'Edit hero' : 'New hero'));

  open(): void {
    this.activeHero.set(null);
    this.opened.set(true);
  }

  close(): void {
    this.opened.set(false);
  }

  onSearch(term: string): void {
    this.term.set(term);
  }

  openDrawerEdition(event: Hero): void {
    this.activeHero.set(event ?? null);
    this.opened.set(true);
  }
}
