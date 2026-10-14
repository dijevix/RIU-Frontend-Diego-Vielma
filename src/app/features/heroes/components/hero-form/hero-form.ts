import { Component, effect, inject, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmModal } from '../../../../core/components/confirm-modal/confirm-modal';
import { trimmedLength } from '../../../../core/common/helpers/trimmed-length.validator';
import { Uppercase } from '../../../../core/directives/uppercase/uppercase';
import { Loading } from '../../../../core/loading/loading';
import { Modal } from '../../../../core/modal/modal';
import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, Uppercase],
  selector: 'app-hero-form',
  styleUrl: './hero-form.scss',
  templateUrl: './hero-form.html',
})
export class HeroForm {
  readonly activeHero = input<Hero | null>();
  readonly heroService = inject(HeroService);
  readonly modalService = inject(Modal);
  private readonly loading = inject(Loading);
  readonly saved = output<void>();
  readonly cancelled = output<void>();
  readonly name = new FormControl('', {
    nonNullable: true,
    validators: [trimmedLength(3, 25)],
  });
  readonly realName = new FormControl('', {
    nonNullable: true,
    validators: [trimmedLength(3, 25)],
  });
  readonly lastName = new FormControl('', {
    nonNullable: true,
    validators: [trimmedLength(3, 25)],
  });
  readonly city = new FormControl('', {
    nonNullable: true,
    validators: [trimmedLength(3, 25)],
  });

  constructor() {
    effect(() => {
      const hero = this.activeHero();
      if (!hero) {
        this.resetForm();
        return;
      }
      this.name.setValue(hero.name);
      this.realName.setValue(hero.realName);
      this.lastName.setValue(hero.lastName);
      this.city.setValue(hero.city);
    });
  }


  save(event: Event): void {
    event.preventDefault();
    if (this.name.invalid || this.realName.invalid || this.lastName.invalid || this.city.invalid) {
      return;
    }

    const data = {
      name: this.name.value.trim(),
      realName: this.realName.value.trim(),
      lastName: this.lastName.value.trim(),
      city: this.city.value.trim(),
    }

    const hero = this.activeHero();
    if (hero) {
      this.modalService.openModal(ConfirmModal, {
        data: {
          title: 'Edit hero',
          message: 'Are you sure you want to edit ' + hero.name + '?',
          onConfirm: () => this.triggerConfirmation({ ...data, id: hero.id }),
          onCancel: () => this.modalService.closeModal(),
        },
      });
      return;
    }

    this.loading.show();
    setTimeout(() => {
      this.heroService.create(data);
      this.finishTrigger();
    }, 1000);
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  resetForm(): void {
    this.name.reset();
    this.realName.reset();
    this.lastName.reset();
    this.city.reset();
  }

  finishTrigger(): void {
    this.loading.hide();
    this.resetForm();
    this.saved.emit();
  }

  triggerConfirmation(hero: Hero): void {
    this.modalService.closeModal();
    this.loading.show();
    setTimeout(() => {
      this.heroService.updateHero(hero);
      this.finishTrigger();
    }, 1000);
  }
}
