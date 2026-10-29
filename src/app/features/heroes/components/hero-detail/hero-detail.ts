import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmModal } from '../../../../core/components/confirm-modal/confirm-modal';
import { Modal } from '../../../../core/modal/modal';
import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero';
import { HeroForm } from '../hero-form/hero-form';

@Component({
  imports: [RouterLink, MatButtonModule, HeroForm],
  selector: 'app-hero-detail',
  styleUrl: './hero-detail.scss',
  templateUrl: './hero-detail.html',
})
export class HeroDetail {
  private readonly heroService = inject(HeroService);
  private readonly modalService = inject(Modal);
  private readonly router = inject(Router);
  readonly id = input.required<string>();
  readonly hero = computed(() => this.heroService.getHero(Number(this.id())));
  readonly editing = signal(false);
  private readonly title = viewChild<ElementRef<HTMLElement>>('title');

  constructor() {
    afterNextRender(() => this.title()?.nativeElement.focus());
  }

  startEdit(): void {
    this.editing.set(true);
  }

  stopEdit(): void {
    this.editing.set(false);
  }

  remove(hero: Hero): void {
    this.modalService.openModal(ConfirmModal, {
      data: {
        title: 'Delete hero',
        message: 'Are you sure you want to delete ' + hero.name + '?',
        onConfirm: () => this.onConfirmRemoving(hero),
        onCancel: () => this.modalService.closeModal(),
      },
    });
  }

  private onConfirmRemoving(hero: Hero): void {
    this.modalService.closeModal();
    this.heroService.deleteHero(hero.id).subscribe(() => {
      void this.router.navigate(['/heroes']);
    });
  }
}
