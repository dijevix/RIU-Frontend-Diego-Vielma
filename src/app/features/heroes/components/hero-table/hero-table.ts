import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ConfirmModal } from '../../../../core/components/confirm-modal/confirm-modal';
import { KebabMenu, KebabMenuItem } from '../../../../core/components/kebab-menu/kebab-menu';
import { Loading } from '../../../../core/loading/loading';
import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero';
import { Modal } from '../../../../core/modal/modal';

@Component({
  imports: [MatTableModule, MatPaginatorModule, KebabMenu],
  selector: 'app-hero-table',
  styleUrl: './hero-table.scss',
  templateUrl: './hero-table.html',
})
export class HeroTable {
  private readonly heroService = inject(HeroService);
  private readonly modalService = inject(Modal);
  private readonly loading = inject(Loading);
  private readonly currentPageSize = signal<number>(10);
  private readonly pageIndex = signal(0);
  readonly term = input('');
  readonly openDrawer = output<Hero>();

  protected readonly pageSize = 10;
  protected readonly pageSizeOptions = [5, 10, 25, 100];
  protected readonly columns = ['id', 'name', 'realName', 'lastName', 'city', 'actions'];
  protected readonly actions: KebabMenuItem[] = [
    { id: 'edit', label: 'Edit' },
    { id: 'remove', label: 'Delete' },
  ];

  private readonly filtered = computed(() => this.heroService.searchHeroes(this.term()));

  protected readonly heroes = computed(() => {
    const start = this.pageIndex() * this.currentPageSize();
    return this.filtered().slice(start, start + this.currentPageSize());
  });

  constructor() {
    effect(() => {
      this.term();
      this.pageIndex.set(0);
    });
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
  }

  protected onAction(actionId: string, hero: Hero): void {
    if (actionId === 'edit') {
      this.edit(hero);
      return;
    }
    if (actionId === 'remove') {
      void this.remove(hero);
    }
  }

  protected edit(hero: Hero): void {
    this.openDrawer.emit(hero);
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
    this.loading.show();
    setTimeout(() => {
      this.heroService.deleteHero(hero.id);
      this.loading.hide();
    }, 1000);
  }

  get totalHeroes(): number {
    return this.filtered().length;
  }
}
