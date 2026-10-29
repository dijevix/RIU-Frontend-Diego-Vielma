import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ConfirmModal } from '../../../../core/components/confirm-modal/confirm-modal';
import { KebabMenu, KebabMenuItem } from '../../../../core/components/kebab-menu/kebab-menu';
import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero';
import { Modal } from '../../../../core/modal/modal';

@Component({
  imports: [MatTableModule, MatPaginatorModule, KebabMenu, RouterLink],
  selector: 'app-hero-table',
  styleUrl: './hero-table.scss',
  templateUrl: './hero-table.html',
})
export class HeroTable {
  private readonly heroService = inject(HeroService);
  private readonly modalService = inject(Modal);
  readonly term = input('');

  protected readonly pageSize = signal(10);
  protected readonly pageIndex = linkedSignal({
    source: this.term,
    computation: () => 0,
  });
  protected readonly pageSizeOptions = [5, 10, 25, 100];
  protected readonly columns = ['id', 'name', 'realName', 'lastName', 'city', 'actions'];
  protected readonly actions: KebabMenuItem[] = [{ id: 'remove', label: 'Delete' }];

  private readonly filtered = computed(() => this.heroService.searchHeroes(this.term()));

  protected readonly heroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected onAction(actionId: string, hero: Hero): void {
    if (actionId === 'remove') {
      void this.remove(hero);
    }
  }

  protected async remove(hero: Hero): Promise<void> {
    this.modalService.openModal(ConfirmModal, {
      data: {
        title: 'Delete hero',
        message: 'Are you sure you want to delete ' + hero.name + '?',
        onConfirm: () => this.onConfirmRemoving(hero),
        onCancel: () => this.modalService.closeModal(),
      },
    });
  }

  protected onConfirmRemoving(hero: Hero): void {
    this.modalService.closeModal();
    this.heroService.deleteHero(hero.id).subscribe();
  }

  get totalHeroes(): number {
    return this.filtered().length;
  }
}
